import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { IsIn, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { AuthUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

class ReadNotificationDto {
  @IsOptional()
  @IsUUID('4')
  id?: string;
}

class DeviceTokenDto {
  @IsString()
  @MinLength(8, { message: 'Bildirim jetonu geçersiz.' })
  @MaxLength(512)
  token!: string;

  @IsIn(['android', 'ios'], { message: 'Platform android veya ios olmalı.' })
  platform!: 'android' | 'ios';
}

@Controller()
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('notifications')
  list(@CurrentUser() user: AuthUser) {
    return this.prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: { id: true, title: true, body: true, readAt: true, createdAt: true },
    });
  }

  @Post('notifications/read')
  async read(@CurrentUser() user: AuthUser, @Body() dto: ReadNotificationDto) {
    await this.prisma.notification.updateMany({
      where: {
        userId: user.id,
        readAt: null,
        ...(dto.id ? { id: dto.id } : {}),
      },
      data: { readAt: new Date() },
    });
    return { ok: true };
  }

  @Post('device-tokens')
  async saveToken(@CurrentUser() user: AuthUser, @Body() dto: DeviceTokenDto) {
    await this.prisma.deviceToken.upsert({
      where: { token: dto.token },
      create: { userId: user.id, token: dto.token, platform: dto.platform },
      update: { userId: user.id, platform: dto.platform },
    });
    return { ok: true };
  }
}
