import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Version,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { RegisterUserDto, UserProfileDto } from './dto';
import { JwtAuthGuard, CurrentUser } from '../auth';
import { UserDocument } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(
    @Body(ValidationPipe) registerUserDto: RegisterUserDto,
  ): Promise<UserProfileDto> {
    return this.usersService.register(registerUserDto);
  }

  @Get('profile/:id')
  @Version('1')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiParam({ name: 'id', description: 'User ObjectId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid ObjectId format' })
  async getProfile(@Param('id') id: string): Promise<UserProfileDto> {
    return this.usersService.getProfile(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @Version('1')
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile retrieved successfully',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUserProfile(
    @CurrentUser() user: UserDocument,
  ): Promise<UserProfileDto> {
    return this.usersService.getProfile(user._id!.toString());
  }
}
