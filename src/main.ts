import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';
import * as compression from 'compression';
import { json, urlencoded } from 'express';
import { WrapRequestInterceptor } from './interceptors/wrap-request.interceptor';
import { UnhandledExceptionFilter } from './filters/unhandled-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalInterceptors(new WrapRequestInterceptor());
  app.useGlobalFilters(new UnhandledExceptionFilter());
  await app.listen(4400);
}
bootstrap();
