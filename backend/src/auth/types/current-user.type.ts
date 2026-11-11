import { FarmRole } from '../../generated/prisma/client.js';

export interface CurrentUserType {
  userId: string;
  email: string;
  farmId: string;
  role: FarmRole;
}