import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../utils/constant';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
