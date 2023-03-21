import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { join } from 'path';

const server = express();

export const createNestServer = async (expressInstance) => {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.SERVICE_ACCOUNT)),
    storageBucket: 'gs://shop-354211.appspot.com'
  })

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressInstance),
    {
      cors: false,
      logger: ['error', 'warn', 'debug'],
      rawBody: true
    }
  );
  
  app.enableCors({origin: '*'});
  app.use(express.json({ limit: '1mb' }));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  process.env.TZ = "America/Sao_Paulo";

  return app.init();
};

createNestServer(server)
    .then(v => console.log('Nest Ready'))
    .catch(err => console.error('Nest broken', err));

export const app = functions.https.onRequest(server);