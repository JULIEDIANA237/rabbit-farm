import { registerEnumType } from '@nestjs/graphql';
import { HealthRecordType } from '../../generated/prisma/client.js';

registerEnumType(HealthRecordType, {
  name: 'HealthRecordType',
  description:
    'OBSERVATION (symptôme constaté), TREATMENT, VACCINATION, ANALYSIS, CONTROL (§38-40)',
});

export { HealthRecordType };
