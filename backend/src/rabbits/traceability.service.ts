import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import type { CurrentUserType } from '../auth/types/current-user.type';
import { RabbitStatus } from '../generated/prisma/client';

import { mapRabbit } from './rabbits.service';

type TraceEvent = {
  date: Date;
  type: string;
  title: string;
  detail?: string | null;
  referenceId?: string | null;
};

const BREEDING_LABELS: Record<string, string> = {
  PLANNED: 'Planifié',
  AWAITING_PALPATION: 'Palpation à faire',
  PREGNANT: 'Gestante',
  NON_PREGNANT: 'Vide',
  INCONCLUSIVE: 'À repalper',
  BIRTH_RECORDED: 'Mise bas enregistrée',
  CANCELLED: 'Annulé',
};

const HEALTH_LABELS: Record<string, string> = {
  OBSERVATION: 'Observation',
  TREATMENT: 'Traitement',
  VACCINATION: 'Vaccination',
  ANALYSIS: 'Analyse',
  CONTROL: 'Contrôle',
};

const REASON_LABELS: Record<string, string> = {
  INITIAL_ASSIGNMENT: 'Première affectation',
  BREEDING: 'Reproduction',
  MATERNITY: 'Maternité',
  FATTENING: 'Engraissement',
  QUARANTINE: 'Quarantaine',
  CLEANING: 'Nettoyage',
  HEALTH: 'Santé',
  SALE: 'Vente',
  AGGRESSION: 'Agressivité',
  OVERCROWDING: 'Surpopulation',
  SEX_SEPARATION: 'Séparation des sexes',
  SIZE_DIFFERENCE: 'Différence de taille',
  OTHER: 'Autre',
};

const summary = { select: { id: true, code: true, sex: true, status: true, birthDate: true } } as const;

const EXIT_LABELS: Record<string, string> = {
  [RabbitStatus.DEAD]: 'Décès',
  [RabbitStatus.CULLED]: 'Réforme',
  [RabbitStatus.TRANSFERRED]: 'Transfert',
  [RabbitStatus.SOLD]: 'Vente',
};

/**
 * Traçabilité complète d'un lapin (§54) :
 * origine, emplacements, lots, sevrage, adoptions, pesées,
 * soins, reproduction, vente et sortie, dans l'ordre chronologique.
 */
@Injectable()
export class TraceabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async rabbitTraceability(rabbitId: string, currentUser: CurrentUserType) {
    const rabbit = await this.prisma.rabbit.findFirst({
      where: { id: rabbitId, farmId: currentUser.farmId },
      include: {
        identifications: true,
        photos: true,
        breed: true,
        father: summary,
        mother: summary,
        birthLitter: { select: { id: true, code: true, liveBorn: true } },
        cageMovements: {
          include: { cage: { select: { code: true } } },
          orderBy: { startedAt: 'asc' },
        },
        lotMemberships: { include: { lot: { select: { code: true } } } },
        weaningHistory: { include: { weaning: true } },
        adoptionHistory: {
          include: {
            adoption: {
              include: {
                sourceLitter: { select: { code: true } },
                destinationLitter: { select: { code: true } },
              },
            },
          },
        },
        weighings: true,
        healthRecords: true,
        breedingsAsFemale: { include: { male: { select: { code: true } } } },
        breedingsAsMale: { include: { female: { select: { code: true } } } },
        saleItems: { include: { sale: { include: { customer: true } } } },
        mortalities: true,
      },
    });

    if (!rabbit) {
      throw new NotFoundException('Lapin introuvable.');
    }

    const events: TraceEvent[] = [];

    if (rabbit.birthDate) {
      events.push({
        date: rabbit.birthDate,
        type: 'BIRTH',
        title: 'Naissance',
        detail: rabbit.birthLitter
          ? `Portée ${rabbit.birthLitter.code}`
          : [rabbit.mother?.code && `Mère ${rabbit.mother.code}`, rabbit.father?.code && `Père ${rabbit.father.code}`]
              .filter(Boolean)
              .join(' · ') || null,
        referenceId: rabbit.birthLitter?.id ?? null,
      });
    }

    for (const m of rabbit.cageMovements) {
      events.push({
        date: m.startedAt,
        type: 'CAGE',
        title: `Entrée en cage ${m.cage.code}`,
        detail: [m.reason && (REASON_LABELS[m.reason] ?? m.reason), m.endedAt && `jusqu'au ${m.endedAt.toISOString().slice(0, 10)}`]
          .filter(Boolean)
          .join(' · ') || null,
        referenceId: m.cageId,
      });
    }

    for (const lm of rabbit.lotMemberships) {
      events.push({
        date: lm.joinedAt,
        type: 'LOT',
        title: `Entrée dans le lot ${lm.lot.code}`,
        referenceId: lm.lotId,
      });
      if (lm.leftAt) {
        events.push({
          date: lm.leftAt,
          type: 'LOT',
          title: `Sortie du lot ${lm.lot.code}`,
          detail: lm.reason,
          referenceId: lm.lotId,
        });
      }
    }

    for (const w of rabbit.weaningHistory) {
      events.push({
        date: w.weaning.actualDate ?? w.weaning.plannedDate,
        type: 'WEANING',
        title: 'Sevrage',
        detail: w.weight != null ? `${Number(w.weight)} kg` : null,
        referenceId: w.weaningId,
      });
    }

    for (const a of rabbit.adoptionHistory) {
      events.push({
        date: a.adoption.adoptedAt,
        type: 'ADOPTION',
        title: `Adoption ${a.adoption.sourceLitter.code} → ${a.adoption.destinationLitter.code}`,
        detail: a.adoption.reason,
        referenceId: a.adoptionId,
      });
    }

    for (const w of rabbit.weighings) {
      const weight = w.averageWeight ?? w.totalWeight / Math.max(1, w.animalCount);
      events.push({
        date: w.date,
        type: 'WEIGHING',
        title: `Pesée : ${Number(weight.toFixed(3))} kg`,
        detail: w.ageInDays != null ? `${w.ageInDays} jours` : null,
        referenceId: w.id,
      });
    }

    for (const h of rabbit.healthRecords) {
      events.push({
        date: h.date,
        type: 'HEALTH',
        title: HEALTH_LABELS[h.type] ?? h.type,
        detail: [h.diagnosis, h.treatment, h.medication].filter(Boolean).join(' · ') || h.observation,
        referenceId: h.id,
      });
    }

    for (const b of rabbit.breedingsAsFemale) {
      events.push({
        date: b.breedingDate,
        type: 'BREEDING',
        title: `Saillie avec ${b.male.code}`,
        detail: BREEDING_LABELS[b.status] ?? b.status,
        referenceId: b.id,
      });
    }
    for (const b of rabbit.breedingsAsMale) {
      events.push({
        date: b.breedingDate,
        type: 'BREEDING',
        title: `Saillie de ${b.female.code}`,
        detail: BREEDING_LABELS[b.status] ?? b.status,
        referenceId: b.id,
      });
    }

    for (const item of rabbit.saleItems) {
      events.push({
        date: item.sale.saleDate,
        type: 'SALE',
        title: `Vente${item.sale.customer ? ` à ${item.sale.customer.name}` : ''}`,
        detail: `${Number(item.totalPrice)}${item.weightKg ? ` · ${item.weightKg} kg` : ''}`,
        referenceId: item.saleId,
      });
    }

    // Vente d'un lot entier : la sortie du lot porte la date de la vente.
    const lotSaleKeys = rabbit.lotMemberships
      .filter((lm) => lm.leftAt && lm.reason === 'Vente')
      .map((lm) => ({ lotId: lm.lotId, saleDate: lm.leftAt as Date }));

    if (lotSaleKeys.length) {
      const lotItems = await this.prisma.saleItem.findMany({
        where: {
          OR: lotSaleKeys.map((key) => ({
            lotId: key.lotId,
            sale: { saleDate: key.saleDate, farmId: currentUser.farmId },
          })),
        },
        include: { sale: { include: { customer: true } }, lot: { select: { code: true } } },
      });

      for (const item of lotItems) {
        events.push({
          date: item.sale.saleDate,
          type: 'SALE',
          title: `Vente du lot ${item.lot?.code ?? ''}${item.sale.customer ? ` à ${item.sale.customer.name}` : ''}`.trim(),
          detail: item.description,
          referenceId: item.saleId,
        });
      }
    }

    if (rabbit.status !== RabbitStatus.ACTIVE && rabbit.status !== RabbitStatus.SOLD) {
      events.push({
        date: rabbit.exitDate ?? rabbit.updatedAt,
        type: 'EXIT',
        title: EXIT_LABELS[rabbit.status] ?? rabbit.status,
        detail: rabbit.exitCause,
      });
    }

    events.sort((a, b) => a.date.getTime() - b.date.getTime());

    return {
      rabbit: mapRabbit({
        ...rabbit,
        cageMovements: rabbit.cageMovements
          .filter((m) => !m.endedAt)
          .map((m) => ({ cage: { id: m.cageId, code: m.cage.code } })),
      }),
      father: rabbit.father,
      mother: rabbit.mother,
      birthLitterCode: rabbit.birthLitter?.code ?? null,
      events,
    };
  }
}
