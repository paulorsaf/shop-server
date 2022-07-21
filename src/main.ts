import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';

async function bootstrap() {
  admin.initializeApp({
    credential: admin.credential.cert('./src/service-account.json'),
    storageBucket: 'gs://shop-354211.appspot.com'
  })

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug']
  });

  app.enableCors({
    origin: '*'
  })

  await app.listen(3000);
}
bootstrap()
  .then(() => console.log('Nest Ready'))
  .catch(err => console.error('Nest broken', err));
