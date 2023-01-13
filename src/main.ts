import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import * as cookieParser from 'cookie-parser';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = config.get('server.port');

  app.use(cookieParser());
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(port);
}
bootstrap();
