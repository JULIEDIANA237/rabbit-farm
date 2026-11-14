import { registerEnumType } from '@nestjs/graphql';

import { FeedingCategory } from '../../generated/prisma/client.js';

registerEnumType(FeedingCategory, {
  name: 'FeedingCategory',
  description: 'Gestante, allaitante, engraissement ou entretien (tous les autres lapins).',
});

export { FeedingCategory };
