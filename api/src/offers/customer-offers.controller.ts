import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OffersService } from './offers.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class CustomerOffersController {
  constructor(private readonly offers: OffersService) {}

  @Get('listings/:id/offers')
  forListing(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.offers.forOwner(user, id);
  }

  @Get('stores/:id')
  store(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.offers.storeForOwner(user, id);
  }
}
