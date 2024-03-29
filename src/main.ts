import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
// import * as csurf from 'csurf.js';
import { SocketIoAdapter } from './assets/adapters/ws.adapter.js';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import events from 'events';
events.EventEmitter.defaultMaxListeners = 100;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'dev' ? ['warn', 'error'] : ['error'],
  });
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.use(helmet());
  // app.use(csurf());
  app.enableCors();
  await app.listen(3000);
}

console.log(`Started in ${process.env.NODE_ENV} mode.`);

bootstrap();
