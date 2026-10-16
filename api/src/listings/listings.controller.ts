import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateListingDto } from './dto/create-listing.dto';
import { MulterExceptionFilter } from './multer-exception.filter';
import { photoUploadOptions } from './photo-upload';
import { ListingsService } from './listings.service';

@Controller('listings')
@UseGuards(JwtAuthGuard)
export class ListingsController {
  constructor(private readonly listings: ListingsService) {}

  @Get()
  mine(@CurrentUser() user: AuthUser) {
    return this.listings.mine(user);
  }

  @Get(':id')
  one(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.listings.one(user, id);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateListingDto) {
    return this.listings.create(user, dto);
  }

  @Post('submit')
  @UseFilters(MulterExceptionFilter)
  @UseInterceptors(FilesInterceptor('photos', 5, photoUploadOptions))
  submit(
    @CurrentUser() user: AuthUser,
    @UploadedFiles()
    files: Array<{ filename: string; mimetype: string; path: string }>,
    @Body()
    body: {
      categoryId?: string;
      deviceTypeId?: string;
      specs?: string;
      condition?: string;
    },
  ) {
    return this.listings.submit(user, body, files ?? []);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    await this.listings.remove(user, id);
  }
}
