// src/common/types/authenticated-request.type.ts
import { Request } from 'express';
import { JwtPayload } from './jwt-payload.type';
import { RefreshTokenPayload } from '../../modules/auth/strategies/refresh-jwt.strategy';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export interface RefreshRequest extends Request {
  user: RefreshTokenPayload;
}
