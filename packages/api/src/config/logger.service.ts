import { Injectable, LoggerService, ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppLoggerService extends ConsoleLogger implements LoggerService {
  constructor(private readonly configService: ConfigService) {
    super('App');
  }

  private isLogEnabled(): boolean {
    return this.configService.get<boolean>('logging.enabled', true);
  }

  private getLogLevel(): string {
    return this.configService.get<string>('logging.level', 'info');
  }

  private shouldLog(level: string): boolean {
    if (!this.isLogEnabled()) {
      return false;
    }

    const currentLevel = this.getLogLevel();
    const levels = ['error', 'warn', 'info', 'debug', 'verbose'];
    const currentLevelIndex = levels.indexOf(currentLevel);
    const messageLevelIndex = levels.indexOf(level);

    return messageLevelIndex <= currentLevelIndex;
  }

  private formatLogMessage(message: any, context?: string): string {
    const timestamp = new Date().toISOString();
    const ctx = context ? `[${context}] ` : '';
    return `[${timestamp}] ${ctx}${message}`;
  }

  log(message: any, context?: string): void {
    if (this.shouldLog('info')) {
      super.log(this.formatLogMessage(message, context));
    }
  }

  error(message: any, trace?: string, context?: string): void {
    if (this.shouldLog('error')) {
      super.error(this.formatLogMessage(message, context), trace);
    }
  }

  warn(message: any, context?: string): void {
    if (this.shouldLog('warn')) {
      super.warn(this.formatLogMessage(message, context));
    }
  }

  debug(message: any, context?: string): void {
    if (this.shouldLog('debug')) {
      super.debug(this.formatLogMessage(message, context));
    }
  }

  verbose(message: any, context?: string): void {
    if (this.shouldLog('verbose')) {
      super.verbose(this.formatLogMessage(message, context));
    }
  }

  // Additional convenience methods
  info(message: any, context?: string): void {
    this.log(message, context);
  }

  // Structured logging methods
  logWithMeta(
    level: string,
    message: string,
    meta: Record<string, any>,
    context?: string,
  ): void {
    const metaStr =
      Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    const fullMessage = `${message}${metaStr}`;

    switch (level) {
      case 'error':
        this.error(fullMessage, undefined, context);
        break;
      case 'warn':
        this.warn(fullMessage, context);
        break;
      case 'debug':
        this.debug(fullMessage, context);
        break;
      case 'verbose':
        this.verbose(fullMessage, context);
        break;
      default:
        this.log(fullMessage, context);
    }
  }

  // HTTP request logging
  logRequest(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    context = 'HTTP',
  ): void {
    this.logWithMeta(
      'info',
      `${method} ${url} ${statusCode} - ${responseTime}ms`,
      {
        method,
        url,
        statusCode,
        responseTime,
      },
      context,
    );
  }

  // Authentication logging
  logAuth(
    action: string,
    userId?: string,
    email?: string,
    context = 'Auth',
  ): void {
    const message = `Auth: ${action}`;
    this.logWithMeta(
      'info',
      message,
      {
        action,
        userId,
        email,
      },
      context,
    );
  }

  // Database logging
  logDatabase(
    operation: string,
    collection: string,
    duration?: number,
    context = 'Database',
  ): void {
    const message = `DB: ${operation} on ${collection}`;
    this.logWithMeta(
      'debug',
      message,
      {
        operation,
        collection,
        ...(duration && { duration }),
      },
      context,
    );
  }
}
