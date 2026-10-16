import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { AuthUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ListingsService } from './listings.service';

@Controller('admin/listings')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminListingsController {
  constructor(private readonly listings: ListingsService) {}

  @Get()
  all() {
    return this.listings.allForAdmin();
  }

  @Get(':id')
  one(@Param('id') id: string) {
    return this.listings.oneForAdmin(id);
  }

  @Post(':id/close')
  close(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.listings.close(user, id);
  }
}
