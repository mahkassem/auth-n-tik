import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../types/auth.types';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // eslint-disable-next-line @typescript-eslint/unbound-method
        JwtRefreshStrategy.extractJWT,
        ExtractJwt.fromBodyField('refreshToken'),
      ]),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('auth.jwtRefreshSecret') ||
        'fallback-refresh-secret',
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'refresh_token' in req.cookies) {
      return req.cookies.refresh_token as string;
    }
    return null;
  }

  async validate(req: Request, payload: JwtPayload): Promise<any> {
    const refreshToken =
      (req.cookies?.refresh_token as string | undefined) ||
      (req.body as { refreshToken?: string })?.refreshToken;
    const user = await this.usersService.findById(payload.sub);

    if (!user || !refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Attach refreshToken to the user document
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (user as any).refreshToken = refreshToken;
    return user;
  }
}
