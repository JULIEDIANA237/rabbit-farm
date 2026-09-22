import { registerEnumType } from '@nestjs/graphql';

export enum TaskSourceType {
  MANUAL = 'MANUAL',
  BREEDING = 'BREEDING',
  PREGNANCY = 'PREGNANCY',
  BIRTH = 'BIRTH',
  WEANING = 'WEANING',
  HEALTH = 'HEALTH',
  SALE = 'SALE',
  INVENTORY = 'INVENTORY',
  OTHER = 'OTHER',
}

registerEnumType(TaskSourceType, {
  name: 'TaskSourceType',
});