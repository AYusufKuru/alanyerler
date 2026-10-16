import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin/logs')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AuditController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: { actor: { select: { id: true, name: true, email: true } } },
    });
  }
}
