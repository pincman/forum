import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { useContainer } from 'class-validator';
import { isNil } from 'lodash';

import { AppModule } from './app.module';

async function bootstrap() {
    if (isNil(process.env.NODE_ENV)) {
        process.env.NODE_ENV = 'production';
    }
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.listen(process.env.NODE_ENV === 'production' ? 3600 : 3000, '0.0.0.0');
}
bootstrap();
