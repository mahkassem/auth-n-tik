import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '8000', 10),
  debug: process.env.DEBUG === 'true',
  logEnabled: process.env.LOG_ENABLED !== 'false',
  logLevel: process.env.LOG_LEVEL || process.env.LOGS_LEVEL || 'info',
  secret: process.env.APP_SECRET || 'default-secret-change-in-production',
}));
