import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthUser } from '../auth/auth.types';
import { CreateOfferDto, UpdateOfferDto } from './dto/offer.dto';
import { OffersService } from './offers.service';

@Controller('admin/offers')
@UseGuards(JwtAuthGuard, AdminGuard)
export class OffersController {
  constructor(private readonly offers: OffersService) {}

  @Get()
  forListing(@Query('listingId') listingId: string) {
    return this.offers.forListing(listingId);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateOfferDto) {
    return this.offers.create(user, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateOfferDto,
  ) {
    return this.offers.update(user, id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.offers.remove(user, id);
  }
}
