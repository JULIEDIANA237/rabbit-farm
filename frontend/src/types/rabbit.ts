export type RabbitSex = 'MALE' | 'FEMALE' | 'UNKNOWN';

export interface RabbitPhoto {
  id: string;
  rabbitId: string;
  url: string;
  filename: string;
  mimeType: string;
  isPrimary: boolean;
  createdAt: string;
}

export type RabbitStatus =
  | 'ACTIVE'
  | 'SOLD'
  | 'DEAD'
  | 'TRANSFERRED'
  | 'CULLED';

export interface Rabbit {
  id: string;
  code: string;
  sex: RabbitSex;
  status?: RabbitStatus | null;

  birthDate?: string | null;
  birthLitterId?: string | null;

  color?: string | null;
  weight?: number | null;
  observations?: string | null;

  breedId?: string | null;
  crossBreedId?: string | null;

  fatherId?: string | null;
  motherId?: string | null;

   photos: RabbitPhoto[];

  createdAt?: string;
  updatedAt?: string;

  identifications?: RabbitIdentification[];
}

export interface RabbitOption {
  id: string;
  code: string;
  sex: RabbitSex;
}

export interface CreateRabbitInput {
  code: string;
  sex: RabbitSex;

  breedId?: string;
  crossBreedId?: string;

  fatherId?: string;
  motherId?: string;

  birthDate?: string;

  color?: string;

  weight?: number;

  observations?: string;
}


export interface RabbitsPage {
  items: Rabbit[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface RabbitIdentification {
  id: string;
  type: string;
  value: string;
}

export interface RabbitDetails extends Rabbit {
  birthLitterId?: string | null;

  createdAt: string;
  updatedAt: string;

  identifications: RabbitIdentification[];
}

export interface UpdateRabbitInput {
  id: string;

  code?: string;
  sex?: RabbitSex;
  status?: RabbitStatus;

  breedId?: string;
  crossBreedId?: string;

  color?: string;
  weight?: number;
  observations?: string;
}

export const RABBIT_SEX_LABELS: Record<
  RabbitSex,
  string
> = {
  UNKNOWN: 'Sexe inconnu',
  MALE: 'Mâle',
  FEMALE: 'Femelle',
};

export const RABBIT_STATUS_LABELS: Record<
  RabbitStatus,
  string
> = {
  ACTIVE: 'Actif',
  SOLD: 'Vendu',
  DEAD: 'Mort',
  CULLED: 'Abattu',
  TRANSFERRED: 'Transféré',
};
