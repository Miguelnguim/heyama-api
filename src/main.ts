import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Activation du CORS configuré pour la production
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://heyama-frontend.vercel.app'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Utilisation du port fourni par Render ou 3000 par défaut
  const port = process.env.PORT || 3000;
  
  // '0.0.0.0' est crucial pour que Render puisse router le trafic vers ton app
  await app.listen(port, '0.0.0.0'); 
  
  logger.log(`🚀 Application Backend lancée sur le port : ${port}`);
  logger.log(`Autorisation CORS pour : https://heyama-frontend.vercel.app`);
}
bootstrap();