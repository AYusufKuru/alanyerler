import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthUser } from './auth.types';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    if (request.user?.role !== Role.admin) {
      throw new ForbiddenException('Bu işlem için yönetici girişi gerekir.');
    }
    return true;
  }
}
