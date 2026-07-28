import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/types/roles.enum';

// users/dto/create-user.dto.ts — admin-facing
export class CreateUserDto {
  @IsEmail() email: string;
  @IsString() @MinLength(2) name: string;
  @IsString() @MinLength(8) password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role; // ← only an admin route accepts this
}
