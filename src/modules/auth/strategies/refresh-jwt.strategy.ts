// src/modules/auth/strategies/refresh-jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../../common/types/jwt-payload.type';

export interface RefreshTokenPayload extends JwtPayload {
  refreshToken: string;
}

// validates the refresh token sent as "Authorization: Bearer <token>" on POST /auth/refresh
@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('jwt.secret'),
      passReqToCallback: true,
    });
  }

  // AuthService.refresh() needs the raw token itself (to check it against the
  // stored hash), not just the decoded payload — so we pull it back out of
  // the request here and attach it alongside the payload.
  validate(req: Request, payload: JwtPayload): RefreshTokenPayload {
    const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    return { ...payload, refreshToken };
  }
}
