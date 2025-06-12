import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/entities/user.entity';
import { JwtPayload, AuthTokens, AuthResponse } from './types/auth.types';
import { AppLoggerService } from '../config/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private logger: AppLoggerService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    this.logger.debug(
      `Validating user credentials for: ${email}`,
      'AuthService',
    );
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      this.logger.logAuth('login_success', user._id?.toString(), user.email);
      return user;
    }
    this.logger.warn(`Failed login attempt for email: ${email}`, 'AuthService');
    return null;
  }

  async login(user: UserDocument): Promise<AuthResponse> {
    this.logger.info(
      `User login: ${user.email} (${user._id?.toString()})`,
      'AuthService',
    );
    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user._id!.toString(),
        email: user.email,
        fullName: user.fullName,
      },
      tokens,
    };
  }

  async refreshTokens(user: UserDocument): Promise<AuthTokens> {
    return this.generateTokens(user);
  }

  async generateTokens(user: UserDocument): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user._id!.toString(),
      email: user.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('auth.jwtSecret'),
        expiresIn: this.configService.get<string>('auth.jwtExpiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('auth.jwtRefreshSecret'),
        expiresIn: this.configService.get<string>('auth.jwtRefreshExpiresIn'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  logout(): Promise<{ message: string }> {
    return Promise.resolve({ message: 'Logged out successfully' });
  }

  getCookieOptions() {
    return {
      httpOnly: true,
      secure: this.configService.get<boolean>('auth.cookieSecure'),
      sameSite: this.configService.get<string>('auth.cookieSameSite') as
        | 'strict'
        | 'lax'
        | 'none',
      maxAge: this.configService.get<number>('auth.cookieMaxAge'),
    };
  }

  // Debug method for testing logging
  testLogging(): void {
    this.logger.debug('Debug level test message', 'AuthService');
    this.logger.info('Info level test message', 'AuthService');
    this.logger.warn('Warn level test message', 'AuthService');
    this.logger.error('Error level test message', undefined, 'AuthService');
    this.logger.verbose('Verbose level test message', 'AuthService');

    this.logger.logAuth('test_action', 'test-user-id', 'test@example.com');
    this.logger.logWithMeta(
      'info',
      'Test structured logging',
      {
        userId: 'test-123',
        action: 'test_action',
        timestamp: new Date().toISOString(),
      },
      'AuthService',
    );
  }
}
