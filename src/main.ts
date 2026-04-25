import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Activation du CORS dynamique
  // On autorise localhost pour le dev et plus tard ton domaine Vercel
  app.enableCors({
    origin: true, // En développement, 'true' autorise tout. En prod, on pourra lister les domaines.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 2. Préfixe global (Optionnel mais recommandé)
  // Permet d'avoir des URLs type : http://localhost:3000/api/objects
  // app.setGlobalPrefix('api');

  // 3. Gestion du Port dynamique pour le déploiement
  // Render/Railway injectent une variable d'environnement PORT
  const port = process.env.PORT || 3000;
  
  await app.listen(port, '0.0.0.0'); // '0.0.0.0' est crucial pour les déploiements Cloud
  
  logger.log(`🚀 Application Backend lancée sur : http://localhost:${port}`);
}
bootstrap();