import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 🔹 Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Upload e Servidor de Arquivos')
    .setDescription(
      'API NestJS para upload e gerenciamento de arquivos estáticos (imagens, PDFs, etc).',
    )
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 🔹 Permitir CORS (caso o front use o servidor)
  app.enableCors();

  // 🔹 Porta padrão
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log(`🚀 Aplicação rodando em: http://localhost:${PORT}`);
  console.log(`📘 Swagger disponível em: http://localhost:${PORT}/api`);
}

bootstrap();
