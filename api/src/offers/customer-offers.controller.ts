import { Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
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

  @Post('listings/:id/offers/:offerId/accept')
  @HttpCode(200)
  accept(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Param('offerId') offerId: string,
  ) {
    return this.offers.accept(user, id, offerId);
  }

  @Get('stores/:id')
  store(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.offers.storeForOwner(user, id);
  }
}
