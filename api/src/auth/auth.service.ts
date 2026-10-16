import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthResponse, AuthUser } from './auth.types';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly audit: AuditService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Bu e-posta ile kayıtlı bir hesap var.');
    }

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash: await bcrypt.hash(dto.password, BCRYPT_ROUNDS),
        role: Role.customer,
      },
    });

    await this.audit.log(user.id, 'user.create', 'user', user.id, {
      email: user.email,
      role: user.role,
    });

    return this.toResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    const passwordMatches = user
      ? await bcrypt.compare(dto.password, user.passwordHash)
      : false;

    if (!user || !passwordMatches) {
      throw new UnauthorizedException('E-posta veya şifre hatalı.');
    }
    if (!user.active) {
      throw new UnauthorizedException('Bu hesap pasif.');
    }

    await this.audit.log(user.id, 'login', 'user', user.id, {
      email: user.email,
    });

    return this.toResponse(user);
  }

  async changePassword(
    current: AuthUser,
    dto: ChangePasswordDto,
  ): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: current.id },
    });
    if (!user || !user.active) {
      throw new UnauthorizedException('Oturum geçersiz.');
    }

    const currentMatches = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!currentMatches) {
      throw new BadRequestException('Mevcut şifre hatalı.');
    }
    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException(
        'Yeni şifre mevcut şifreyle aynı olamaz.',
      );
    }

    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS) },
    });

    await this.audit.log(user.id, 'password.change', 'user', user.id);

    return this.toResponse(updated);
  }

  private toResponse(user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  }): AuthResponse {
    return {
      accessToken: this.jwt.sign({ sub: user.id, role: user.role }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
