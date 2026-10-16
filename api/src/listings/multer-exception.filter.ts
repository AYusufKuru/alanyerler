import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';
import { MulterError } from 'multer';

@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(error: MulterError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const message =
      error.code === 'LIMIT_FILE_SIZE'
        ? 'Bir fotoğraf 8 MB sınırını aşıyor.'
        : 'Fotoğraf yüklenemedi.';
    response.status(400).json({
      statusCode: 400,
      message,
      error: 'Bad Request',
    });
  }
}
