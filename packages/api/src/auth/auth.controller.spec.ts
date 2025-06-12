import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { Types } from 'mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserDocument } from '../users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
    refreshTokens: jest.fn(),
    logout: jest.fn(),
    getCookieOptions: jest.fn(),
  };

  const mockUser: UserDocument = {
    _id: new Types.ObjectId('123e4567e89b12d3a4564266'),
    email: 'test@example.com',
    fullName: 'John Doe',
    password: 'hashedPassword@123',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as UserDocument;

  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login user and set cookies', async () => {
      const mockAuthResponse = {
        user: {
          id: mockUser._id!.toString(),
          email: mockUser.email,
          fullName: mockUser.fullName,
        },
        tokens: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
      };

      const mockCookieOptions = {
        httpOnly: true,
        secure: false,
        sameSite: 'lax' as const,
        maxAge: 604800000,
      };

      mockAuthService.login.mockResolvedValue(mockAuthResponse);
      mockAuthService.getCookieOptions.mockReturnValue(mockCookieOptions);

      await controller.login(mockUser, mockResponse);

      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
      expect(mockAuthService.getCookieOptions).toHaveBeenCalled();

      // Verify cookies are set
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        'mock-access-token',
        mockCookieOptions,
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'mock-refresh-token',
        {
          ...mockCookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        },
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'next-auth.session-token',
        'mock-access-token',
        mockCookieOptions,
      );

      // Verify response is sent
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAuthResponse);
    });
  });

  describe('refresh', () => {
    it('should refresh tokens and update cookies', async () => {
      const mockTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      const mockCookieOptions = {
        httpOnly: true,
        secure: false,
        sameSite: 'lax' as const,
        maxAge: 604800000,
      };

      mockAuthService.refreshTokens.mockResolvedValue(mockTokens);
      mockAuthService.getCookieOptions.mockReturnValue(mockCookieOptions);

      await controller.refresh(mockUser, mockResponse);

      expect(mockAuthService.refreshTokens).toHaveBeenCalledWith(mockUser);
      expect(mockAuthService.getCookieOptions).toHaveBeenCalled();

      // Verify cookies are updated
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        'new-access-token',
        mockCookieOptions,
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'new-refresh-token',
        {
          ...mockCookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        },
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'next-auth.session-token',
        'new-access-token',
        mockCookieOptions,
      );

      // Verify response is sent
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTokens);
    });
  });

  describe('logout', () => {
    it('should logout user and clear cookies', async () => {
      const mockLogoutResponse = { message: 'Logged out successfully' };

      mockAuthService.logout.mockResolvedValue(mockLogoutResponse);

      await controller.logout(mockResponse);

      expect(mockAuthService.logout).toHaveBeenCalled();

      // Verify cookies are cleared
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('access_token');
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('refresh_token');
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        'next-auth.session-token',
      );

      // Verify response is sent
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockLogoutResponse);
    });
  });

  describe('getProfile', () => {
    it('should return user profile without password', () => {
      const result = controller.getProfile(mockUser);

      expect(result).toEqual({
        id: mockUser._id!.toString(),
        email: mockUser.email,
        fullName: mockUser.fullName,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });

      // Ensure password is not included
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('verify', () => {
    it('should return user verification info', () => {
      const result = controller.verify(mockUser);

      expect(result).toEqual({
        valid: true,
        user: {
          id: mockUser._id!.toString(),
          email: mockUser.email,
          fullName: mockUser.fullName,
        },
      });
    });
  });
});
