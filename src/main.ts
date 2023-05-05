import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import { json } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  admin.initializeApp({
    credential: admin.credential.cert('./src/service-account.json'),
    storageBucket: 'gs://shop-354211.appspot.com'
  })

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({origin: '*'});
  app.use(json({ limit: '1mb' }));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  
  process.env.TZ = "America/Sao_Paulo";

  await app.listen(3000);
}
bootstrap()
  .then(() => console.log('Nest Ready'))
  .catch(err => console.error('Nest broken', err));
