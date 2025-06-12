import {
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export enum LogLevel {
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Verbose = 'verbose',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @Min(1000)
  @Max(65535)
  @Type(() => Number)
  PORT: number = 8000;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  DEBUG: boolean = false;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  LOG_ENABLED: boolean = true;

  @IsEnum(LogLevel)
  LOG_LEVEL: LogLevel = LogLevel.Info;

  @IsString()
  APP_SECRET: string = 'default-secret-change-in-production';

  @IsString()
  MONGODB_CONNECTION_STRING: string =
    'mongodb://admin:admin@localhost:27017/auth-n-tik_db?authSource=admin';
}
