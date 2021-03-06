import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
// import * as csurf from 'csurf';
import { SocketIoAdapter } from './plugins/adapters/ws.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['warn', 'error'],
  });
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.use(helmet());
  // app.use(csurf());
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
