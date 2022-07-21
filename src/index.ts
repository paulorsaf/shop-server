import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const server = express();

export const createNestServer = async (expressInstance) => {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.SERVICE_ACCOUNT)),
    storageBucket: 'gs://shop-354211.appspot.com'
  })

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
    {
      cors: false,
      logger: ['error', 'warn', 'debug']
    }
  );
  
  app.enableCors({
    origin: '*'
  })

  return app.init();
};

createNestServer(server)
    .then(v => console.log('Nest Ready'))
    .catch(err => console.error('Nest broken', err));

export const app = functions.https.onRequest(server);