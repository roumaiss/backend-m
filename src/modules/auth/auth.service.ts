// src/modules/auth/auth.service.ts
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import type { StringValue } from 'ms';

import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../../common/types/jwt-payload.type';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<{ user: User; tokens: Tokens }> {
    const user = await this.usersService.create(dto);
    const tokens = await this.issueTokens(user);
    await this.usersService.setRefreshTokenHash(user.id, tokens.refreshToken);
    return { user, tokens };
  }

  async login(dto: LoginDto): Promise<{ user: User; tokens: Tokens }> {
    const user = await this.usersService.findByEmail(dto.email);

    // same error for unknown email and wrong password — don't leak which
    if (!user || !(await argon2.verify(user.passwordHash, dto.password))) {
      throw new UnauthorizedException('Password or email is incorrect');
    }

    const tokens = await this.issueTokens(user);
    await this.usersService.setRefreshTokenHash(user.id, tokens.refreshToken);
    return { user, tokens };
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.setRefreshTokenHash(userId, null);
  }

  async refresh(userId: string, presentedToken: string): Promise<Tokens> {
    const user = await this.usersService.findById(userId);

    if (!user?.refreshTokenHash) {
      throw new ForbiddenException('Access denied');
    }

    const valid = await argon2.verify(user.refreshTokenHash, presentedToken);
    if (!valid) {
      // token reuse — someone has an old copy. Kill the session entirely.
      await this.usersService.setRefreshTokenHash(user.id, null);
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.issueTokens(user);
    await this.usersService.setRefreshTokenHash(user.id, tokens.refreshToken);
    return tokens;
  }

  private async issueTokens(user: User): Promise<Tokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const secret = this.config.getOrThrow<string>('jwt.secret');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret,
        expiresIn: this.config.get<StringValue>('jwt.expiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret,
        expiresIn: this.config.get<StringValue>('jwt.refreshTokenExpiresIn'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
