import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './configurations';
import { validate } from './config.validation';
import { AppLoggerService } from './logger.service';

// Simple logging configuration inline
const loggingConfig = () => ({
  logging: {
    enabled: process.env.LOG_ENABLED !== 'false',
    level: process.env.LOG_LEVEL || process.env.LOGS_LEVEL || 'info',
  },
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env', '.env.development', '.env.production', '.env.test'],
      load: [config, loggingConfig],
      validate,
    }),
  ],
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class AppConfigModule {}
