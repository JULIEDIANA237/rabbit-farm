import { FarmRole } from '../../generated/prisma/client';

export interface CurrentUserType {
  userId: string;
  email: string;
  farmId: string;
  role: FarmRole;
}