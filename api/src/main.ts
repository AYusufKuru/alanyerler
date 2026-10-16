import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      const local = !origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      callback(null, local);
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const constraints = errors[0]?.constraints;
        const message = constraints
          ? Object.values(constraints)[0]
          : 'Gönderilen bilgiler hatalı.';
        return new BadRequestException(message);
      },
    }),
  );
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

bootstrap();
