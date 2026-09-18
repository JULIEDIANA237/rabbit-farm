import { SetMetadata } from '@nestjs/common';
import { FarmRole } from '../../generated/prisma/client';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: FarmRole[]) => {
  return SetMetadata(
    ROLES_KEY,
    roles,
  );
};