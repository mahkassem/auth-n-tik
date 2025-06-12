# Authentication Module

This module provides JWT-based authentication with support for refresh tokens, cookies, and NextAuth compatibility.

## Features

- **JWT Authentication**: Access tokens with configurable expiration
- **Refresh Tokens**: Long-lived refresh tokens for seamless user experience
- **Cookie Support**: Automatic cookie management for web applications
- **NextAuth Compatible**: Support for NextAuth.js integration
- **TypeScript**: Full type safety with custom decorators
- **Password Validation**: Local strategy for username/password authentication

## Installation

The required dependencies are already installed:

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt passport-local
npm install @types/passport-jwt @types/passport-local cookie-parser @types/cookie-parser
```

## Configuration

Add the following environment variables to your `.env` file:

```env
# JWT Authentication
JWT_SECRET=your-jwt-secret-change-in-production
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your-jwt-refresh-secret-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Cookie Configuration
COOKIE_SECRET=your-cookie-secret-change-in-production
COOKIE_SAME_SITE=lax
COOKIE_MAX_AGE=604800000

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

## Usage

### Protecting Routes

Use the `JwtAuthGuard` to protect routes:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard, CurrentUser } from '../auth';
import { User } from '../users/entities/user.entity';

@Controller('protected')
export class ProtectedController {
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }
}
```

### Authentication Endpoints

#### POST /auth/login
Login with email and password:

```json
{
  "email": "user@example.com",
  "password": "password@123"
}
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
  },
  "tokens": {
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

#### POST /auth/refresh
Refresh access token using refresh token (from cookie or body):

```json
{
  "refreshToken": "refresh-token"
}
```

#### POST /auth/logout
Logout and clear cookies (requires authentication).

#### GET /auth/profile
Get current user profile (requires authentication).

#### GET /auth/verify
Verify token validity (requires authentication).

### NextAuth Integration

The module sets compatible cookies for NextAuth.js:

- `access_token`: JWT access token
- `refresh_token`: JWT refresh token
- `next-auth.session-token`: NextAuth compatible session token

### Custom Decorators

#### @CurrentUser()
Extract the current authenticated user:

```typescript
@UseGuards(JwtAuthGuard)
@Get('me')
getMe(@CurrentUser() user: User) {
  return user;
}
```

### Guards

- `JwtAuthGuard`: Protects routes with JWT authentication
- `LocalAuthGuard`: Validates username/password for login
- `JwtRefreshGuard`: Validates refresh tokens

### Strategies

- `JwtStrategy`: Validates JWT tokens from Authorization header or cookies
- `LocalStrategy`: Validates username/password combinations
- `JwtRefreshStrategy`: Validates refresh tokens

## Security Features

- **HttpOnly Cookies**: Prevents XSS attacks
- **Secure Cookies**: HTTPS only in production
- **SameSite Protection**: CSRF protection
- **Password Hashing**: bcryptjs with salt rounds
- **Token Expiration**: Configurable expiration times
- **Refresh Token Rotation**: New refresh tokens on refresh

## Error Handling

The module throws appropriate HTTP exceptions:

- `401 Unauthorized`: Invalid credentials or expired tokens
- `403 Forbidden`: Access denied
- `400 Bad Request`: Invalid request format

## Development

To test the authentication:

1. Start the server: `npm run start:dev`
2. Register a user: `POST /users/register`
3. Login: `POST /auth/login`
4. Access protected routes with the returned token

## Production Notes

- Change all default secrets in production
- Use HTTPS for secure cookies
- Consider rate limiting for auth endpoints
- Implement proper logging and monitoring
- Use environment-specific configurations
