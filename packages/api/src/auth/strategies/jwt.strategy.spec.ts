import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../types/auth.types';
import { User } from '../../users/entities/user.entity';
import { Types } from 'mongoose';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let usersService: UsersService;
  let configService: ConfigService;

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
        JwtStrategy,
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

    mockConfigService.get.mockReturnValue('test-jwt-secret');
    strategy = module.get<JwtStrategy>(JwtStrategy);
    usersService = module.get<UsersService>(UsersService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should return user when payload is valid', async () => {
      const payload: JwtPayload = {
        sub: mockUser._id!.toString(),
        email: mockUser.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await strategy.validate(payload);

      expect(mockUsersService.findById).toHaveBeenCalledWith(payload.sub);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const payload: JwtPayload = {
        sub: 'non-existent-id',
        email: 'nonexistent@example.com',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      mockUsersService.findById.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(strategy.validate(payload)).rejects.toThrow(
        'User not found',
      );

      expect(mockUsersService.findById).toHaveBeenCalledWith(payload.sub);
    });
  });

  describe('extractJWT', () => {
    it('should extract JWT from cookies', () => {
      const mockRequest = {
        cookies: {
          access_token: 'test-token-from-cookie',
        },
      };

      // Access the private static method through the class
      const extractJWT = (JwtStrategy as any).extractJWT;
      const result = extractJWT(mockRequest);

      expect(result).toBe('test-token-from-cookie');
    });

    it('should return null when no cookies are present', () => {
      const mockRequest = {
        cookies: {},
      };

      const extractJWT = (JwtStrategy as any).extractJWT;
      const result = extractJWT(mockRequest);

      expect(result).toBeNull();
    });

    it('should return null when cookies object is missing', () => {
      const mockRequest = {};

      const extractJWT = (JwtStrategy as any).extractJWT;
      const result = extractJWT(mockRequest);

      expect(result).toBeNull();
    });
  });
});
