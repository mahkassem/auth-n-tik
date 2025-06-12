import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../types/auth.types';
import { User } from '../../users/entities/user.entity';
import { Types } from 'mongoose';

interface MockRequest {
  cookies?: { [key: string]: string };
  body?: { [key: string]: any };
}

describe('JwtRefreshStrategy', () => {
  let strategy: JwtRefreshStrategy;

  const mockUsersService = {
    findById: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
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
        JwtRefreshStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    mockConfigService.get.mockReturnValue('test-refresh-secret');
    strategy = module.get<JwtRefreshStrategy>(JwtRefreshStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should return user with refresh token from cookies', async () => {
      const payload: JwtPayload = {
        sub: mockUser._id!.toString(),
        email: mockUser.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      const mockRequest: MockRequest = {
        cookies: {
          refresh_token: 'test-refresh-token',
        },
      };

      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await strategy.validate(mockRequest as any, payload);

      expect(mockUsersService.findById).toHaveBeenCalledWith(payload.sub);
      expect(result).toEqual({
        ...mockUser,
        refreshToken: 'test-refresh-token',
      });
    });

    it('should return user with refresh token from body', async () => {
      const payload: JwtPayload = {
        sub: mockUser._id!.toString(),
        email: mockUser.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      const mockRequest: MockRequest = {
        body: {
          refreshToken: 'test-refresh-token',
        },
      };

      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await strategy.validate(mockRequest as any, payload);

      expect(mockUsersService.findById).toHaveBeenCalledWith(payload.sub);
      expect(result).toEqual({
        ...mockUser,
        refreshToken: 'test-refresh-token',
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const payload: JwtPayload = {
        sub: 'non-existent-id',
        email: 'nonexistent@example.com',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      const mockRequest: MockRequest = {
        cookies: {
          refresh_token: 'test-refresh-token',
        },
      };

      mockUsersService.findById.mockResolvedValue(null);

      await expect(
        strategy.validate(mockRequest as any, payload),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        strategy.validate(mockRequest as any, payload),
      ).rejects.toThrow('Invalid refresh token');

      expect(mockUsersService.findById).toHaveBeenCalledWith(payload.sub);
    });

    it('should throw UnauthorizedException when refresh token is missing', async () => {
      const payload: JwtPayload = {
        sub: mockUser._id!.toString(),
        email: mockUser.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      const mockRequest: MockRequest = {
        cookies: {},
        body: {},
      };

      mockUsersService.findById.mockResolvedValue(mockUser);

      await expect(
        strategy.validate(mockRequest as any, payload),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        strategy.validate(mockRequest as any, payload),
      ).rejects.toThrow('Invalid refresh token');
    });
  });

  describe('extractJWT', () => {
    it('should extract JWT from cookies', () => {
      const mockRequest = {
        cookies: {
          refresh_token: 'test-refresh-token-from-cookie',
        },
      };

      // Access the private static method through the class
      const extractJWT = (JwtRefreshStrategy as any).extractJWT;
      const result = extractJWT(mockRequest);

      expect(result).toBe('test-refresh-token-from-cookie');
    });

    it('should return null when no cookies are present', () => {
      const mockRequest = {
        cookies: {},
      };

      const extractJWT = (JwtRefreshStrategy as any).extractJWT;
      const result = extractJWT(mockRequest);

      expect(result).toBeNull();
    });

    it('should return null when cookies object is missing', () => {
      const mockRequest = {};

      const extractJWT = (JwtRefreshStrategy as any).extractJWT;
      const result = extractJWT(mockRequest);

      expect(result).toBeNull();
    });
  });
});
