// src/modules/users/users.service.ts

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const email = dto.email.toLowerCase().trim();

    if (await this.repo.exists({ where: { email } })) {
      throw new ConflictException('Email already registered');
    }

    const user = this.repo.create({
      email,
      name: dto.name,
      passwordHash: await argon2.hash(dto.password),
    });

    return this.repo.save(user);
  }

  findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByIdOrFail(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email: email.toLowerCase().trim() } });
  }

  async setRefreshTokenHash(
    userId: string,
    token: string | null,
  ): Promise<void> {
    await this.repo.update(userId, {
      refreshTokenHash: token ? await argon2.hash(token) : null,
    });
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    await this.repo.update(userId, {
      passwordHash: await argon2.hash(newPassword),
      refreshTokenHash: null, // force re-login everywhere
    });
  }
}
