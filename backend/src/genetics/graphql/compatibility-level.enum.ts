import { registerEnumType } from '@nestjs/graphql';

export enum CompatibilityLevel {
  COMPATIBLE = 'COMPATIBLE',
  WARNING = 'WARNING',
  BLOCKED = 'BLOCKED',
}

registerEnumType(CompatibilityLevel, {
  name: 'CompatibilityLevel',
  description: 'Résultat du contrôle généalogique avant accouplement.',
});
