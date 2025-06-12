# Logging Configuration Example

This document shows how to configure logging using environment variables in the auth-n-tik API.

## Environment Variables

### LOG_ENABLED
Controls whether logging is enabled or disabled.
- `true` (default): Logging is enabled
- `false`: Logging is disabled (silent mode)

### LOG_LEVEL  
Sets the logging level. Messages at or above this level will be displayed.
- `error`: Only error messages
- `warn`: Warning and error messages
- `info` (default): Info, warning, and error messages
- `debug`: Debug, info, warning, and error messages
- `verbose`: All messages including verbose

## Environment Files

### Development (.env.development)
```bash
LOG_ENABLED=true
LOG_LEVEL=debug
```

### Production (.env.production)
```bash
LOG_ENABLED=true
LOG_LEVEL=warn
```

### Testing (.env.test)
```bash
LOG_ENABLED=false
LOG_LEVEL=error
```

## Usage Examples

### In Services
```typescript
import { AppLoggerService } from '../config/logger.service';

@Injectable()
export class MyService {
  constructor(private logger: AppLoggerService) {}

  async doSomething() {
    this.logger.info('Service operation started', 'MyService');
    this.logger.debug('Debug information', 'MyService');
    this.logger.error('Something went wrong', 'MyService');
    
    // Authentication logging
    this.logger.logAuth('login_success', userId, email);
    
    // HTTP request logging
    this.logger.logRequest('GET', '/api/users', 200, 150);
    
    // Database operation logging
    this.logger.logDatabase('find', 'users', 25);
  }
}
```

### Testing Different Log Levels

To test the logging functionality:

1. **Enable debug logging:**
   ```bash
   export LOG_ENABLED=true
   export LOG_LEVEL=debug
   npm run start:dev
   ```

2. **Disable logging:**
   ```bash
   export LOG_ENABLED=false
   npm run start:dev
   ```

3. **Error level only:**
   ```bash
   export LOG_ENABLED=true
   export LOG_LEVEL=error
   npm run start:dev
   ```

## Log Output Format

The logger formats messages with timestamps and context:
```
[2025-06-11T19:54:03.079Z] [Bootstrap] Application is starting up...
[2025-06-11T19:54:03.090Z] [AuthService] Validating user credentials for: user@example.com
[2025-06-11T19:54:03.095Z] [Auth] Auth: login_success {"action":"login_success","userId":"123","email":"user@example.com"}
```
