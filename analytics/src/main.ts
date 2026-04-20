import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3001, '0.0.0.0');
  console.log('Listening on http://127.0.0.1:3001');
}
bootstrap();