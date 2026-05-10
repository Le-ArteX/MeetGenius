import { SetMetadata } from '@nestjs/common';
import { AppRole } from '../../../../../packages/database/generated/prisma';

export const ROLES_KEY = 'app_roles';
export const AppRoles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);
