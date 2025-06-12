import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AppLoggerService } from './config/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Configure custom logger
  const logger = app.get(AppLoggerService);
  app.useLogger(logger);

  // Log application startup
  logger.info('Application is starting up...', 'Bootstrap');

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Enable CORS for Next.js frontend
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:8000',
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Cookie parser middleware
  app.use(cookieParser(configService.get<string>('auth.cookieSecret')));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('auth-n-tik API')
    .setDescription('The auth-n-tik API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addCookieAuth('access-token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get<number>('app.port', 8000);
  await app.listen(port);

  // Log successful startup
  const env = configService.get<string>('app.nodeEnv');
  const logEnabled = configService.get<boolean>('logging.enabled', true);
  logger.info(
    `Application is running on port ${port} in ${env} environment (logging: ${logEnabled ? 'enabled' : 'disabled'})`,
    'Bootstrap',
  );
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
