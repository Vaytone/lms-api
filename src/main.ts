import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app/app.module';
import { CORS_URL } from './constants/core';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: CORS_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('VAYTONE LMS')
    .setDescription('VAYTONE API description')
    .setVersion('0.0.1')
    .addTag('LMS')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('lms-api', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());

  await app.listen(process.env.APP_PORT || 5000, () => {
    console.log(
      `LMS-API started http://localhost:${process.env.APP_PORT || 5000}`,
    );
  });
}
bootstrap();
