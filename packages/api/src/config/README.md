# Configuration Module

This module provides a centralized configuration system for the auth-n-tik API using NestJS ConfigModule with validation and type safety.

## Features

- **Environment Variables Validation**: Validates all required environment variables on startup
- **Type Safety**: TypeScript interfaces for all configuration values
- **Namespaced Configuration**: Organized by service domains (app, database)
- **Global Access**: Configuration service available throughout the application
- **Environment-specific files**: Support for different environments

## Environment Variables

### App Configuration

- `NODE_ENV`: Application environment (development, production, test)
- `PORT`: Server port (default: 8000)
- `DEBUG`: Enable debug mode (true/false)
- `LOGS_LEVEL`: Logging level (error, warn, info, debug, verbose)
- `APP_SECRET`: Secret key for JWT and other security features

### Database Configuration

- `MONGODB_CONNECTION_STRING`: Full MongoDB connection string

## Setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your actual values:

   ```env
   NODE_ENV=development
   PORT=8000
   DEBUG=true
   LOGS_LEVEL=debug
   APP_SECRET=your-secret-key-here
   POSTGRES_CONNECTION_STRING=postgresql://username:password@localhost:5432/auth-n-tik_db
   ```

## Usage

### Basic Configuration Access

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SomeService {
  constructor(private configService: ConfigService) {}

  someMethod() {
    // Access app configuration
    const port = this.configService.get<number>('app.port');
    const nodeEnv = this.configService.get<string>('app.nodeEnv');
    const debug = this.configService.get<boolean>('app.debug');

    // Access database configuration
    const dbConnectionString = this.configService.get<string>(
      'database.postgres.connectionString',
    );
  }
}
```

### Adding New Configuration

1. Create a new config file (e.g., `redis.config.ts`):

   ```typescript
   import { registerAs } from '@nestjs/config';

   export const redisConfig = registerAs('redis', () => ({
     host: process.env.REDIS_HOST || 'localhost',
     port: parseInt(process.env.REDIS_PORT || '6379', 10),
     password: process.env.REDIS_PASSWORD,
   }));
   ```

2. Register it in `config.module.ts`:

   ```typescript
   import { redisConfig } from './redis.config';

   @Module({
     imports: [
       ConfigModule.forRoot({
         // ...existing config
         load: [appConfig, databaseConfig, redisConfig],
       }),
     ],
   })
   ```

3. Export it in `index.ts`:

   ```typescript
   export * from './redis.config';
   ```

## Available Endpoints

- `GET /` - Basic hello world with config info
- `GET /health` - Detailed health check with configuration overview

## Make Commands

Use the provided Makefile commands:

```bash
# Development
make api-dev        # Start in development mode
make api-build      # Build the application
make api-lint       # Run linter

# Production
make api-start      # Start in production mode
```

## Environment Files

The configuration supports environment-specific files with the following priority:

1. `.env.{NODE_ENV}.local` (highest priority)
2. `.env.{NODE_ENV}`
3. `.env.local`
4. `.env` (lowest priority)

### Available Environment Files

- `.env` - Default configuration
- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.test` - Test environment
- `.env.example` - Template file

## Validation

The configuration module automatically validates all environment variables on application startup using class-validator. If any required variables are missing or invalid, the application will fail to start with a descriptive error message.

## File Structure

```text
src/config/
├── app.config.ts           # App-specific configuration
├── database.config.ts      # Database configuration
├── config.module.ts        # Main configuration module
├── config.validation.ts    # Validation logic
├── validation.ts           # Validation schemas
├── index.ts               # Exports
└── README.md              # This file
```

## Configuration Schema

### App Configuration Schema

- `app.nodeEnv`: Current environment
- `app.port`: Server port number
- `app.debug`: Debug mode flag
- `app.logsLevel`: Logging level
- `app.secret`: Application secret key

### Database Configuration Schema

- `database.postgres.connectionString`: PostgreSQL connection string

## Environment-Specific Configuration Examples

### .env.development

```env
NODE_ENV=development
PORT=8001
DEBUG=true
LOGS_LEVEL=debug
APP_SECRET=dev-secret-key
POSTGRES_CONNECTION_STRING=postgresql://localhost:5432/auth-n-tik_dev
```

### .env.production

```env
NODE_ENV=production
PORT=8000
DEBUG=false
LOGS_LEVEL=info
APP_SECRET=production-secret-key
POSTGRES_CONNECTION_STRING=postgresql://prod-host:5432/auth-n-tik_prod
```

### .env.test

```env
NODE_ENV=test
PORT=8002
DEBUG=false
LOGS_LEVEL=error
APP_SECRET=test-secret-key
POSTGRES_CONNECTION_STRING=postgresql://localhost:5432/auth-n-tik_test
```

## Type Safety

The configuration module provides full TypeScript type safety:

```typescript
// Type-safe configuration access
const appConfig = this.configService.get<AppConfig>('app');
const dbConfig = this.configService.get<DatabaseConfig>('database');

// Individual property access with types
const port = this.configService.get<number>('app.port');
const connectionString = this.configService.get<string>(
  'database.uri',
);
```

## Best Practices

1. **Always use namespaced configuration**: Access config via `app.property` or `database.property`
2. **Provide default values**: Ensure fallback values for non-critical configuration
3. **Validate environment variables**: Use the validation schema to catch configuration errors early
4. **Use environment-specific files**: Keep different configurations for different environments
5. **Keep secrets secure**: Use `.env.local` for local development secrets and never commit them

This configuration module provides a robust, type-safe, and validated configuration system for the auth-n-tik API.
