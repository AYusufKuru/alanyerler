import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuditService } from '../audit/audit.service';
import { AuthUser } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

const publicUser = {
  id: true,
  name: true,
  email: true,
  role: true,
  active: true,
  createdAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  list() {
    return this.prisma.user.findMany({
      select: publicUser,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(actor: AuthUser, dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Bu e-posta ile kayıtlı bir hesap var.');
    const user = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email: dto.email,
        passwordHash: await bcrypt.hash(dto.password, 10),
        role: dto.role === 'admin' ? Role.admin : Role.customer,
      },
      select: publicUser,
    });
    await this.audit.log(actor.id, 'user.create', 'user', user.id, {
      email: user.email,
      role: user.role,
    });
    return user;
  }

  async update(actor: AuthUser, id: string, dto: UpdateUserDto) {
    if (dto.password === undefined && dto.active === undefined) {
      throw new BadRequestException('Güncellenecek bir alan yok.');
    }
    const current = await this.prisma.user.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('Kullanıcı bulunamadı.');
    if (dto.active === false && current.id === actor.id) {
      throw new BadRequestException('Kendi hesabını pasife alamazsın.');
    }
    const user = await this.prisma.user.update({
      where: { id: current.id },
      data: {
        ...(dto.password ? { passwordHash: await bcrypt.hash(dto.password, 10) } : {}),
        ...(dto.active !== undefined ? { active: dto.active } : {}),
      },
      select: publicUser,
    });
    if (dto.password) {
      await this.audit.log(actor.id, 'password.assign', 'user', user.id, { email: user.email });
    }
    if (dto.active === false) {
      await this.audit.log(actor.id, 'user.deactivate', 'user', user.id, { email: user.email });
    }
    if (dto.active === true && !current.active) {
      await this.audit.log(actor.id, 'user.activate', 'user', user.id, { email: user.email });
    }
    return user;
  }
}
