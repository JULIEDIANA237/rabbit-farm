import { registerEnumType } from '@nestjs/graphql';
import { InbreedingPolicy } from '../../generated/prisma/client.js';

registerEnumType(InbreedingPolicy, {
  name: 'InbreedingPolicy',
  description:
    'WARN : simple avertissement pour demi-frères/sœurs et ancêtres communs. BLOCK : blocage.',
});

export { InbreedingPolicy };
