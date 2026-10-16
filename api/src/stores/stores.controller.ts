import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '../auth/admin.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthUser } from '../auth/auth.types';
import { MulterExceptionFilter } from '../listings/multer-exception.filter';
import { photoUploadOptions } from '../listings/photo-upload';
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';
import { StoresService } from './stores.service';

type StoreFiles = {
  logo?: Express.Multer.File[];
  cover?: Express.Multer.File[];
};

@Controller('admin/stores')
@UseGuards(JwtAuthGuard, AdminGuard)
export class StoresController {
  constructor(private readonly stores: StoresService) {}

  @Get()
  all() {
    return this.stores.all();
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateStoreDto) {
    return this.stores.create(user, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateStoreDto,
  ) {
    return this.stores.update(user, id, dto);
  }

  @Post(':id/images')
  @UseFilters(MulterExceptionFilter)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'logo', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
      ],
      { ...photoUploadOptions, limits: { fileSize: 8 * 1024 * 1024, files: 2 } },
    ),
  )
  images(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @UploadedFiles() files: StoreFiles,
  ) {
    return this.stores.setImages(user, id, files ?? {});
  }
}
