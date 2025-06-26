// vercel.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Context, Handler } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import * as express from 'express';
import { AppModule } from './app.module';

let cachedServer: any = null;

async function bootstrapServer() {
  if (!cachedServer) {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);
    const app = await NestFactory.create(AppModule, adapter);
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
      origin: '*',
      methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
    await app.init();
    cachedServer = createServer(expressApp);
  }
  return cachedServer;
}

export const handler: Handler = async (event: any, context: Context) => {
  const server = await bootstrapServer();
  return proxy(server, event, context, 'PROMISE').promise;
};
