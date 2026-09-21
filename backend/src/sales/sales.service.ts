import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  RabbitStatus,
  SaleStatus,
} from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CurrentUserType } from '../auth/types/current-user.type';
import { CreateCustomerInput } from './inputs/create-customer.input';
import { CreateSaleInput } from './inputs/create-sale.input';
import { CreatePaymentInput } from './inputs/create-payment.input';

type SaleWithRelations = {
  totalAmount: { toString(): string } | number;
  items: Array<{
    unitPrice: { toString(): string } | number;
    totalPrice: { toString(): string } | number;
  }>;
  payments: Array<{
    amount: { toString(): string } | number;
  }>;
};

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  private toNumber(value: { toString(): string } | number) {
    return Number(value);
  }

  private mapSale<T extends SaleWithRelations>(sale: T) {
    return {
      ...sale,
      totalAmount: this.toNumber(sale.totalAmount),
      items: sale.items.map((item) => ({
        ...item,
        unitPrice: this.toNumber(item.unitPrice),
        totalPrice: this.toNumber(item.totalPrice),
      })),
      payments: sale.payments.map((payment) => ({
        ...payment,
        amount: this.toNumber(payment.amount),
      })),
    };
  }

  private mapPayment(payment: { amount: { toString(): string } | number }) {
    return {
      ...payment,
      amount: this.toNumber(payment.amount),
    };
  }

  createCustomer(input: CreateCustomerInput, currentUser: CurrentUserType) {
    const name = input.name.trim();

    if (!name) {
      throw new BadRequestException('Le nom du client est obligatoire.');
    }

    return this.prisma.customer.create({
      data: {
        farmId: currentUser.farmId,
        name,
        phone: input.phone?.trim() || null,
        email: input.email?.trim().toLowerCase() || null,
        address: input.address?.trim() || null,
        notes: input.notes?.trim() || null,
      },
    });
  }

  customers(currentUser: CurrentUserType) {
    return this.prisma.customer.findMany({
      where: { farmId: currentUser.farmId },
      orderBy: { name: 'asc' },
    });
  }

  async findCustomer(id: string, currentUser: CurrentUserType) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, farmId: currentUser.farmId },
    });

    if (!customer) {
      throw new NotFoundException('Client introuvable.');
    }

    return customer;
  }

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

    const rabbitIds = input.items
      .map((item) => item.rabbitId)
      .filter((id): id is string => Boolean(id));

    if (new Set(rabbitIds).size !== rabbitIds.length) {
      throw new BadRequestException(
        'Un même lapin ne peut pas apparaître deux fois dans une vente.',
      );
    }

    const items: Array<{
      rabbitId?: string;
      description: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }> = [];

    for (const item of input.items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new BadRequestException('La quantité doit être un entier positif.');
      }

      if (item.unitPrice < 0) {
        throw new BadRequestException('Le prix unitaire est invalide.');
      }

      if (item.rabbitId) {
        if (item.quantity !== 1) {
          throw new BadRequestException(
            'La vente d’un lapin identifié doit avoir une quantité de 1.',
          );
        }

        const rabbit = await this.prisma.rabbit.findFirst({
          where: {
            id: item.rabbitId,
            farmId: currentUser.farmId,
          },
        });

        if (!rabbit) {
          throw new NotFoundException('Lapin introuvable.');
        }

        if (rabbit.status !== RabbitStatus.ACTIVE) {
          throw new ConflictException(
            `Le lapin ${rabbit.code} n’est plus disponible à la vente.`,
          );
        }
      }

      const totalPrice = item.quantity * item.unitPrice;

      items.push({
        rabbitId: item.rabbitId,
        description: item.description?.trim() || 'Article',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice,
      });
    }

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
        include: { items: true, payments: true },
      });

      if (rabbitIds.length) {
        await tx.rabbit.updateMany({
          where: { id: { in: rabbitIds } },
          data: { status: RabbitStatus.SOLD },
        });

        await tx.lotMembership.updateMany({
          where: { rabbitId: { in: rabbitIds }, leftAt: null },
          data: { leftAt: saleDate, reason: 'Vente' },
        });
      }

      return created;
    });

    return this.mapSale(sale);
  }

  async sales(currentUser: CurrentUserType) {
    const sales = await this.prisma.sale.findMany({
      where: { farmId: currentUser.farmId },
      include: { items: true, payments: true },
      orderBy: { saleDate: 'desc' },
    });

    return sales.map((sale) => this.mapSale(sale));
  }

  async findSale(id: string, currentUser: CurrentUserType) {
    const sale = await this.prisma.sale.findFirst({
      where: { id, farmId: currentUser.farmId },
      include: { items: true, payments: true },
    });

    if (!sale) {
      throw new NotFoundException('Vente introuvable.');
    }

    return this.mapSale(sale);
  }

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
        'Le paiement dépasse le solde restant de la vente.',
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

      const paid = alreadyPaid + input.amount;

      await tx.sale.update({
        where: { id: sale.id },
        data: {
          status:
            paid + 0.0001 >= totalAmount
              ? SaleStatus.PAID
              : SaleStatus.PARTIALLY_PAID,
        },
      });

      return created;
    });

    return this.mapPayment(payment);
  }
}
