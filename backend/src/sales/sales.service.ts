import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FatteningLotStatus,
  RabbitStatus,
  SaleStatus,
} from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import { CreateCustomerInput } from './inputs/create-customer.input.js';
import { CreateSaleInput } from './inputs/create-sale.input.js';
import { CreatePaymentInput } from './inputs/create-payment.input.js';
import { CancelSaleInput } from './inputs/cancel-sale.input.js';
import { computeSaleStatus, summarizeCustomerAccount } from './sales.utils.js';

type DecimalLike = { toString(): string } | number;

type SaleWithRelations = {
  totalAmount: DecimalLike;
  status: SaleStatus;
  customer?: { name: string } | null;
  items: Array<{
    unitPrice: DecimalLike;
    totalPrice: DecimalLike;
    pricePerKg?: DecimalLike | null;
    rabbit?: { code: string } | null;
    lot?: { code: string } | null;
  }>;
  payments: Array<{
    amount: DecimalLike;
  }>;
};

const saleInclude = {
  customer: { select: { name: true } },
  items: {
    include: {
      rabbit: { select: { code: true } },
      lot: { select: { code: true } },
    },
  },
  payments: { orderBy: { paymentDate: 'asc' as const } },
} as const;

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  private toNumber(value: DecimalLike) {
    return Number(value);
  }

  private mapSale<T extends SaleWithRelations>(sale: T) {
    const { customer, ...rest } = sale;
    const totalAmount = this.toNumber(sale.totalAmount);
    const paidAmount = sale.payments.reduce(
      (sum, payment) => sum + this.toNumber(payment.amount),
      0,
    );

    return {
      ...rest,
      customerName: customer?.name ?? null,
      totalAmount,
      paidAmount,
      remainingAmount:
        sale.status === SaleStatus.CANCELLED
          ? 0
          : Math.max(0, Number((totalAmount - paidAmount).toFixed(2))),
      items: sale.items.map(({ rabbit, lot, ...item }) => ({
        ...item,
        rabbitCode: rabbit?.code ?? null,
        lotCode: lot?.code ?? null,
        unitPrice: this.toNumber(item.unitPrice),
        totalPrice: this.toNumber(item.totalPrice),
        pricePerKg:
          item.pricePerKg != null ? this.toNumber(item.pricePerKg) : null,
      })),
      payments: sale.payments.map((payment) => ({
        ...payment,
        amount: this.toNumber(payment.amount),
      })),
    };
  }

  private mapPayment(payment: { amount: DecimalLike }) {
    return {
      ...payment,
      amount: this.toNumber(payment.amount),
    };
  }

  // ============================================================
  // CLIENTS (§43)
  // ============================================================

  createCustomer(input: CreateCustomerInput, currentUser: CurrentUserType) {
    const name = input.name.trim();
    if (!name) {
      throw new BadRequestException('Le nom du client est obligatoire.');
    }
    return this.prisma.customer
      .create({
        data: {
          farmId: currentUser.farmId,
          name,
          phone: input.phone?.trim() || null,
          email: input.email?.trim().toLowerCase() || null,
          address: input.address?.trim() || null,
          notes: input.notes?.trim() || null,
        },
      })
      .then((customer) => ({
        ...customer,
        saleCount: 0,
        totalPurchases: 0,
        totalPaid: 0,
        outstandingBalance: 0,
      }));
  }

  private async withAccount<T extends { id: string }>(
    customers: T[],
    farmId: string,
  ) {
    if (!customers.length) return [];

    const sales = await this.prisma.sale.findMany({
      where: { farmId, customerId: { in: customers.map((c) => c.id) } },
      select: {
        customerId: true,
        status: true,
        totalAmount: true,
        payments: { select: { amount: true } },
      },
    });

    return customers.map((customer) => ({
      ...customer,
      ...summarizeCustomerAccount(
        sales
          .filter((sale) => sale.customerId === customer.id)
          .map((sale) => ({
            status: sale.status,
            totalAmount: Number(sale.totalAmount),
            paid: sale.payments.reduce((sum, p) => sum + Number(p.amount), 0),
          })),
      ),
    }));
  }

  async customers(currentUser: CurrentUserType) {
    const customers = await this.prisma.customer.findMany({
      where: { farmId: currentUser.farmId },
      orderBy: { name: 'asc' },
    });

    return this.withAccount(customers, currentUser.farmId);
  }

  async findCustomer(id: string, currentUser: CurrentUserType) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, farmId: currentUser.farmId },
    });
    if (!customer) {
      throw new NotFoundException('Client introuvable.');
    }
    const [withAccount] = await this.withAccount([customer], currentUser.farmId);
    return withAccount;
  }

  // ============================================================
  // VENTES (§41)
  // ============================================================

  async createSale(input: CreateSaleInput, currentUser: CurrentUserType) {
    if (!input.items.length) {
      throw new BadRequestException(
        'La vente doit contenir au moins un article.',
      );
    }
    const saleDate = new Date(input.saleDate);
    if (Number.isNaN(saleDate.getTime())) {
      throw new BadRequestException('La date de vente est invalide.');
    }
    if (input.customerId) {
      await this.findCustomer(input.customerId, currentUser);
    }

    const rabbitIds = new Set<string>();
    const lotIds = new Set<string>();

    const items: Array<{
      rabbitId?: string;
      lotId?: string;
      description: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      weightKg?: number;
      pricePerKg?: number;
    }> = [];

    for (const item of input.items) {
      const byWeight = item.weightKg != null || item.pricePerKg != null;

      if (byWeight) {
        if (!(item.weightKg && item.weightKg > 0)) {
          throw new BadRequestException(
            'Le poids vendu doit être supérieur à zéro.',
          );
        }
        if (item.pricePerKg == null || item.pricePerKg < 0) {
          throw new BadRequestException('Le prix au kilo est invalide.');
        }
      } else if (item.unitPrice == null || item.unitPrice < 0) {
        throw new BadRequestException('Le prix unitaire est invalide.');
      }

      let quantity = item.quantity ?? 1;
      let description = item.description?.trim();

      if (item.rabbitId) {
        if (rabbitIds.has(item.rabbitId)) {
          throw new BadRequestException(
            'Un même lapin ne peut pas apparaître deux fois dans une vente.',
          );
        }
        if (quantity !== 1) {
          throw new BadRequestException(
            'La vente d’un lapin identifié doit avoir une quantité de 1.',
          );
        }
        const rabbit = await this.prisma.rabbit.findFirst({
          where: { id: item.rabbitId, farmId: currentUser.farmId },
        });
        if (!rabbit) {
          throw new NotFoundException('Lapin introuvable.');
        }
        if (rabbit.status !== RabbitStatus.ACTIVE) {
          throw new ConflictException(
            `Le lapin ${rabbit.code} n’est plus disponible à la vente.`,
          );
        }
        rabbitIds.add(rabbit.id);
        description ||= `Lapin ${rabbit.code}`;
      }

      if (item.lotId) {
        if (lotIds.has(item.lotId)) {
          throw new BadRequestException(
            'Un même lot ne peut pas apparaître deux fois dans une vente.',
          );
        }
        const lot = await this.prisma.fatteningLot.findFirst({
          where: { id: item.lotId, farmId: currentUser.farmId },
          include: {
            memberships: {
              where: { leftAt: null, rabbit: { status: RabbitStatus.ACTIVE } },
              select: { rabbitId: true },
            },
          },
        });
        if (!lot) {
          throw new NotFoundException('Lot introuvable.');
        }
        if (lot.status !== FatteningLotStatus.ACTIVE) {
          throw new ConflictException(`Le lot ${lot.code} n’est plus actif.`);
        }
        if (!lot.memberships.length) {
          throw new BadRequestException(`Le lot ${lot.code} ne contient aucun lapin actif.`);
        }
        for (const membership of lot.memberships) {
          if (rabbitIds.has(membership.rabbitId)) {
            throw new BadRequestException(
              'Un lapin du lot est déjà vendu individuellement dans cette vente.',
            );
          }
          rabbitIds.add(membership.rabbitId);
        }
        lotIds.add(lot.id);
        quantity = lot.memberships.length;
        description ||= `Lot ${lot.code}`;
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new BadRequestException('La quantité doit être un entier positif.');
      }

      const totalPrice = byWeight
        ? Number(((item.weightKg as number) * (item.pricePerKg as number)).toFixed(2))
        : quantity * (item.unitPrice as number);

      items.push({
        rabbitId: item.rabbitId,
        lotId: item.lotId,
        description: description || 'Article',
        quantity,
        unitPrice: byWeight
          ? Number((totalPrice / quantity).toFixed(2))
          : (item.unitPrice as number),
        totalPrice,
        weightKg: item.weightKg,
        pricePerKg: item.pricePerKg,
      });
    }

    const soldRabbitIds = [...rabbitIds];

    const sale = await this.prisma.$transaction(async (tx) => {
      const created = await tx.sale.create({
        data: {
          farmId: currentUser.farmId,
          customerId: input.customerId,
          saleDate,
          totalAmount: items.reduce((sum, item) => sum + item.totalPrice, 0),
          observation: input.observation?.trim() || null,
          items: { create: items },
        },
        include: saleInclude,
      });

      if (soldRabbitIds.length) {
        await tx.rabbit.updateMany({
          where: { id: { in: soldRabbitIds } },
          data: { status: RabbitStatus.SOLD, exitDate: saleDate, exitCause: 'Vente' },
        });
        await tx.lotMembership.updateMany({
          where: { rabbitId: { in: soldRabbitIds }, leftAt: null },
          data: { leftAt: saleDate, reason: 'Vente' },
        });
        await tx.rabbitCageMovement.updateMany({
          where: { rabbitId: { in: soldRabbitIds }, endedAt: null },
          data: { endedAt: saleDate },
        });
      }

      if (lotIds.size) {
        await tx.fatteningLot.updateMany({
          where: { id: { in: [...lotIds] } },
          data: { status: FatteningLotStatus.COMPLETED, exitDate: saleDate },
        });
        await tx.lotCageMovement.updateMany({
          where: { lotId: { in: [...lotIds] }, endedAt: null },
          data: { endedAt: saleDate },
        });
      }

      return created;
    });

    return this.mapSale(sale);
  }

  async sales(currentUser: CurrentUserType, customerId?: string) {
    const sales = await this.prisma.sale.findMany({
      where: {
        farmId: currentUser.farmId,
        ...(customerId ? { customerId } : {}),
      },
      include: saleInclude,
      orderBy: { saleDate: 'desc' },
    });
    return sales.map((sale) => this.mapSale(sale));
  }

  async findSale(id: string, currentUser: CurrentUserType) {
    const sale = await this.prisma.sale.findFirst({
      where: { id, farmId: currentUser.farmId },
      include: saleInclude,
    });
    if (!sale) {
      throw new NotFoundException('Vente introuvable.');
    }
    return this.mapSale(sale);
  }

  /**
   * Annulation d'une vente sans paiement : les lapins redeviennent actifs.
   */
  async cancelSale(input: CancelSaleInput, currentUser: CurrentUserType) {
    const sale = await this.prisma.sale.findFirst({
      where: { id: input.id, farmId: currentUser.farmId },
      include: { items: true, payments: true },
    });

    if (!sale) {
      throw new NotFoundException('Vente introuvable.');
    }
    if (sale.status === SaleStatus.CANCELLED) {
      throw new ConflictException('Cette vente est déjà annulée.');
    }
    if (sale.payments.length > 0) {
      throw new ConflictException(
        'Impossible d’annuler une vente qui a déjà reçu des paiements.',
      );
    }

    const lotIds = sale.items.map((item) => item.lotId).filter(Boolean) as string[];
    const directRabbitIds = sale.items
      .map((item) => item.rabbitId)
      .filter(Boolean) as string[];

    const updated = await this.prisma.$transaction(async (tx) => {
      const lotMembers = lotIds.length
        ? await tx.lotMembership.findMany({
            where: { lotId: { in: lotIds }, leftAt: sale.saleDate, reason: 'Vente' },
            select: { id: true, rabbitId: true },
          })
        : [];

      const rabbitIds = [...new Set([...directRabbitIds, ...lotMembers.map((m) => m.rabbitId)])];

      if (rabbitIds.length) {
        await tx.rabbit.updateMany({
          where: { id: { in: rabbitIds }, status: RabbitStatus.SOLD },
          data: { status: RabbitStatus.ACTIVE, exitDate: null, exitCause: null },
        });
      }

      if (lotMembers.length) {
        await tx.lotMembership.updateMany({
          where: { id: { in: lotMembers.map((m) => m.id) } },
          data: { leftAt: null, reason: null },
        });
        await tx.fatteningLot.updateMany({
          where: { id: { in: lotIds } },
          data: { status: FatteningLotStatus.ACTIVE, exitDate: null },
        });
      }

      return tx.sale.update({
        where: { id: sale.id },
        data: {
          status: SaleStatus.CANCELLED,
          observation: [sale.observation, input.reason?.trim()]
            .filter(Boolean)
            .join('\n') || null,
        },
        include: saleInclude,
      });
    });

    return this.mapSale(updated);
  }

  // ============================================================
  // PAIEMENTS (§42)
  // ============================================================

  async addPayment(input: CreatePaymentInput, currentUser: CurrentUserType) {
    if (input.amount <= 0) {
      throw new BadRequestException('Le montant doit être supérieur à zéro.');
    }
    const sale = await this.prisma.sale.findFirst({
      where: { id: input.saleId, farmId: currentUser.farmId },
      include: { payments: true },
    });
    if (!sale) {
      throw new NotFoundException('Vente introuvable.');
    }
    if (sale.status === SaleStatus.CANCELLED) {
      throw new ConflictException('Cette vente est annulée.');
    }
    const paymentDate = new Date(input.paymentDate);
    if (Number.isNaN(paymentDate.getTime())) {
      throw new BadRequestException('La date de paiement est invalide.');
    }
    const alreadyPaid = sale.payments.reduce(
      (sum, payment) => sum + this.toNumber(payment.amount),
      0,
    );
    const totalAmount = this.toNumber(sale.totalAmount);
    const remaining = totalAmount - alreadyPaid;
    if (input.amount - remaining > 0.0001) {
      throw new BadRequestException(
        `Le paiement dépasse le solde restant de la vente (${remaining.toFixed(2)}).`,
      );
    }
    const payment = await this.prisma.$transaction(async (tx) => {
      const created = await tx.payment.create({
        data: {
          saleId: sale.id,
          amount: input.amount,
          paymentDate,
          method: input.method,
          reference: input.reference?.trim() || null,
          observation: input.observation?.trim() || null,
        },
      });
      await tx.sale.update({
        where: { id: sale.id },
        data: {
          status: computeSaleStatus(totalAmount, alreadyPaid + input.amount),
        },
      });
      return created;
    });
    return this.mapPayment(payment);
  }
}
