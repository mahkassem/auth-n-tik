import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RegisterUserDto, UserProfileDto } from './dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    register: jest.fn(),
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterUserDto = {
        email: 'test@example.com',
        fullName: 'John Doe',
        password: 'password@123',
      };

      const expectedResult: UserProfileDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        fullName: 'John Doe',
        password: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);

      expect(service.register).toHaveBeenCalledWith(registerDto);
      expect(result).toBe(expectedResult);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedResult: UserProfileDto = {
        id: userId,
        email: 'test@example.com',
        fullName: 'John Doe',
        password: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.getProfile.mockResolvedValue(expectedResult);

      const result = await controller.getProfile(userId);

      expect(service.getProfile).toHaveBeenCalledWith(userId);
      expect(result).toBe(expectedResult);
    });
  });
});
