import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Response,
  HttpCode,
  HttpStatus,
  Version,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';
import {
  LoginDto,
  AuthResponseDto,
  TokensDto,
  AuthVerificationDto,
} from './dto';
import { LocalAuthGuard, JwtAuthGuard, JwtRefreshGuard } from './guards';
import { CurrentUser } from './decorators';
import { UserDocument } from '../users/entities/user.entity';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @CurrentUser() user: UserDocument,
    @Response() res: ExpressResponse,
  ): Promise<void> {
    const authResponse = await this.authService.login(user);
    const cookieOptions = this.authService.getCookieOptions();

    // Set cookies for NextAuth compatibility
    res.cookie('access_token', authResponse.tokens.accessToken, cookieOptions);
    res.cookie('refresh_token', authResponse.tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
    });

    // Also set NextAuth compatible cookies
    res.cookie(
      'next-auth.session-token',
      authResponse.tokens.accessToken,
      cookieOptions,
    );

    // Manually send the response
    res.status(HttpStatus.OK).json(authResponse);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: 'Tokens successfully refreshed',
    type: TokensDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(
    @CurrentUser() user: UserDocument,
    @Response() res: ExpressResponse,
  ): Promise<void> {
    const tokens = await this.authService.refreshTokens(user);
    const cookieOptions = this.authService.getCookieOptions();

    res.cookie('access_token', tokens.accessToken, cookieOptions);
    res.cookie('refresh_token', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('next-auth.session-token', tokens.accessToken, cookieOptions);

    res.status(HttpStatus.OK).json(tokens);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Response() res: ExpressResponse): Promise<void> {
    // Clear cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.clearCookie('next-auth.session-token');

    const logoutResult = await this.authService.logout();
    res.status(HttpStatus.OK).json(logoutResult);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @Version('1')
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@CurrentUser() user: UserDocument) {
    return {
      id: user._id!.toString(),
      email: user.email,
      fullName: user.fullName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  @Version('1')
  @ApiBearerAuth('JWT-auth')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Verify user authentication' })
  @ApiResponse({
    status: 200,
    description: 'User authentication verified',
    type: AuthVerificationDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  verify(@CurrentUser() user: UserDocument) {
    return {
      valid: true,
      user: {
        id: user._id!.toString(),
        email: user.email,
        fullName: user.fullName,
      },
    };
  }

  @Get('debug-log')
  @Version('1')
  @ApiOperation({
    summary: 'Debug endpoint to test logging (development only)',
  })
  debugLog(): { message: string } {
    this.authService.testLogging();
    return { message: 'Debug logging tested - check console' };
  }
}
