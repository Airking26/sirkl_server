import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './main/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )
  const options = new DocumentBuilder()
  .setTitle('Sirkl')
  .setDescription('Sirkl Server')
  .setVersion('1.0')
  .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)
  await app.listen(8080);
}
bootstrap();
