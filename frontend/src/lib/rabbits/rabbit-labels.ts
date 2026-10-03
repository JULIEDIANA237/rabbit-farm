import type {
  RabbitSex,
  RabbitStatus,
} from '@/types/rabbit';

export function getRabbitSexLabel(
  sex: RabbitSex,
): string {
  switch (sex) {
    case 'MALE':
      return 'Mâle';

    case 'FEMALE':
      return 'Femelle';

    case 'UNKNOWN':
      return 'Sexe inconnu';

    default:
      return 'Non renseigné';
  }
}

export function getRabbitSexShortLabel(
  sex: RabbitSex,
): string {
  switch (sex) {
    case 'MALE':
      return 'M';

    case 'FEMALE':
      return 'F';

    case 'UNKNOWN':
      return '?';

    default:
      return '?';
  }
}

export function getRabbitStatusLabel(
  status?: RabbitStatus | null,
): string {
  switch (status) {
    case 'ACTIVE':
      return 'Actif';

    case 'SOLD':
      return 'Vendu';

    case 'DEAD':
      return 'Décédé';

    case 'TRANSFERRED':
      return 'Transféré';

    case 'CULLED':
      return 'Éliminé';

    default:
      return 'Non renseigné';
  }
}