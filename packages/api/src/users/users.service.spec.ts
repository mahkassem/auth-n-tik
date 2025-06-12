import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;

  const MockUserModel = jest.fn().mockImplementation((userData) => ({
    ...userData,
    _id: '123456789012345678901234',
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn().mockResolvedValue({
      ...userData,
      _id: '123456789012345678901234',
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  }));

  // Add static methods to the mock
  Object.assign(MockUserModel, {
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn(),
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn(),
    }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: MockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));

    // Mock bcrypt
    mockedBcrypt.hash.mockResolvedValue('hashedPassword@123' as never);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterUserDto = {
      email: 'test@example.com',
      fullName: 'John Doe',
      password: 'password@123',
    };

    it('should register a new user successfully', async () => {
      const savedUser = {
        _id: '123456789012345678901234',
        email: 'test@example.com',
        fullName: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        save: jest.fn().mockResolvedValue(this),
      };

      (MockUserModel as any).findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.register(registerDto);

      expect(result).toEqual({
        id: '123456789012345678901234',
        email: 'test@example.com',
        fullName: 'John Doe',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const existingUser = {
        _id: '123456789012345678901234',
        email: 'test@example.com',
      };

      (MockUserModel as any).findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existingUser),
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile successfully', async () => {
      const user = {
        _id: '123456789012345678901234',
        email: 'test@example.com',
        fullName: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (MockUserModel as any).findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      const result = await service.getProfile(user._id);

      expect(result).toEqual({
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      (MockUserModel as any).findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getProfile('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
