import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User, UserDocument } from '../users/entities/user.entity';
import { JwtPayload } from './types/auth.types';
import { AppLoggerService } from '../config/logger.service';
import { Types } from 'mongoose';

// Mock bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockAppLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    verbose: jest.fn(),
    logAuth: jest.fn(),
    logWithMeta: jest.fn(),
    logRequest: jest.fn(),
    logDatabase: jest.fn(),
  };

  const mockUser: User = {
    _id: new Types.ObjectId('123456789012345678901234'),
    email: 'test@example.com',
    fullName: 'John Doe',
    password: 'hashedPassword@123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: AppLoggerService,
          useValue: mockAppLoggerService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);

    // Setup default mock values
    mockConfigService.get.mockImplementation((key: string) => {
      const config = {
        'auth.jwtSecret': 'test-jwt-secret',
        'auth.jwtExpiresIn': '1d',
        'auth.jwtRefreshSecret': 'test-refresh-secret',
        'auth.jwtRefreshExpiresIn': '7d',
        'auth.cookieSecure': false,
        'auth.cookieSameSite': 'lax',
        'auth.cookieMaxAge': 604800000,
      };
      return config[key];
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password@123';

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.validateUser(email, password);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password@123';

      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await service.validateUser(email, password);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return auth response with tokens', async () => {
      const mockTokens = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };

      jest.spyOn(service, 'generateTokens').mockResolvedValue(mockTokens);

      const result = await service.login(mockUser as UserDocument);

      expect(service.generateTokens).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        user: {
          id: mockUser._id!.toString(),
          email: mockUser.email,
          fullName: mockUser.fullName,
        },
        tokens: mockTokens,
      });
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', async () => {
      const mockAccessToken = 'mock-access-token';
      const mockRefreshToken = 'mock-refresh-token';

      mockJwtService.signAsync
        .mockResolvedValueOnce(mockAccessToken)
        .mockResolvedValueOnce(mockRefreshToken);

      const result = await service.generateTokens(mockUser as UserDocument);

      const expectedPayload: JwtPayload = {
        sub: mockUser._id!.toString(),
        email: mockUser.email,
      };

      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(
        1,
        expectedPayload,
        {
          secret: 'test-jwt-secret',
          expiresIn: '1d',
        },
      );
      expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(
        2,
        expectedPayload,
        {
          secret: 'test-refresh-secret',
          expiresIn: '7d',
        },
      );

      expect(result).toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });
    });
  });

  describe('refreshTokens', () => {
    it('should generate new tokens for user', async () => {
      const mockTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      jest.spyOn(service, 'generateTokens').mockResolvedValue(mockTokens);

      const result = await service.refreshTokens(mockUser as UserDocument);

      expect(service.generateTokens).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockTokens);
    });
  });

  describe('logout', () => {
    it('should return logout success message', async () => {
      const result = await service.logout();

      expect(result).toEqual({
        message: 'Logged out successfully',
      });
    });
  });

  describe('getCookieOptions', () => {
    it('should return cookie options based on config', () => {
      const result = service.getCookieOptions();

      expect(mockConfigService.get).toHaveBeenCalledWith('auth.cookieSecure');
      expect(mockConfigService.get).toHaveBeenCalledWith('auth.cookieSameSite');
      expect(mockConfigService.get).toHaveBeenCalledWith('auth.cookieMaxAge');

      expect(result).toEqual({
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 604800000,
      });
    });
  });
});
