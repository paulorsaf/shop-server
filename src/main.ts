import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';

async function bootstrap() {
  admin.initializeApp({
    credential: admin.credential.cert('./src/service-account.json')
  })

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
