import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: '*',
        credentials: true,
    });
    const configService: ConfigService = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    const config = new DocumentBuilder()
        .setTitle('Expensy Backend')
        .setDescription('The Expensy API description')
        .setVersion('1.0')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('', app, documentFactory);

    await app.listen(configService.get<number>('port'));
}

bootstrap();
