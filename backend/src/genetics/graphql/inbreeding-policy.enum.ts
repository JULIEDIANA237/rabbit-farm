import { registerEnumType } from '@nestjs/graphql';
import { InbreedingPolicy } from '../../generated/prisma/client';

registerEnumType(InbreedingPolicy, {
  name: 'InbreedingPolicy',
  description:
    'WARN : simple avertissement pour demi-frères/sœurs et ancêtres communs. BLOCK : blocage.',
});

export { InbreedingPolicy };
