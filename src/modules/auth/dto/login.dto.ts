import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// src/modules/auth/dto/login.dto.ts
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
