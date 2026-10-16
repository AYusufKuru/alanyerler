import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { uploadDir } from './upload-path';

@Controller('uploads')
export class UploadsController {
  @Get(':name')
  send(@Param('name') name: string, @Res() response: Response) {
    if (!/^[\w-]+\.(jpg|jpeg|png|webp)$/.test(name)) {
      throw new NotFoundException();
    }
    const file = join(uploadDir(), name);
    if (!existsSync(file)) {
      throw new NotFoundException();
    }
    response.sendFile(file);
  }
}
