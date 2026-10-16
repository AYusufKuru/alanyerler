import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { HealthController } from './health.controller';
import { ListingsModule } from './listings/listings.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OffersModule } from './offers/offers.module';
import { PrismaModule } from './prisma/prisma.module';
import { SiteModule } from './site/site.module';
import { StoresModule } from './stores/stores.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuditModule,
    AuthModule,
    CategoriesModule,
    ListingsModule,
    StoresModule,
    SiteModule,
    OffersModule,
    MessagesModule,
    UsersModule,
    NotificationsModule,
    UploadsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
