import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET || 'jwt-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET || 'jwt-refresh-secret-change-in-production',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  cookieSecret:
    process.env.COOKIE_SECRET || 'cookie-secret-change-in-production',
  cookieSecure: process.env.NODE_ENV === 'production',
  cookieSameSite: process.env.COOKIE_SAME_SITE || 'lax',
  cookieMaxAge: parseInt(process.env.COOKIE_MAX_AGE || '604800000', 10), // 7 days in ms
}));
