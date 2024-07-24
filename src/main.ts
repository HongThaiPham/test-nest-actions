import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ActionHeaderInterceptor } from './interceptors/action-header/action-header.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.useGlobalInterceptors(new ActionHeaderInterceptor());
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
