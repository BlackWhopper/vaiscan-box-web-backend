import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import * as cookieParser from 'cookie-parser';
import { WsAdapter } from '@nestjs/platform-ws';
import * as session from 'express-session';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET,POST',
      credentials: true,
    },
  });

  const port = config.get('server.port');

  app.use(
    cookieParser(),
    session({
      secret: process.env.SESSION_SECRET || config.get('session.secret'),
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(port);
}
bootstrap();
