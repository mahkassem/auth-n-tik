import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { LocalStrategy } from './local.strategy';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let usersService: UsersService;

  const mockUsersService = {
    findByEmail: jest.fn(),
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
        LocalStrategy,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should return user when credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password@123';

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await strategy.validate(email, password);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password@123';

      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(strategy.validate(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(strategy.validate(email, password)).rejects.toThrow(
        'Invalid credentials',
      );

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(strategy.validate(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(strategy.validate(email, password)).rejects.toThrow(
        'Invalid credentials',
      );

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );
    });
  });
});
