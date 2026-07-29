import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateProductVariantDto {
  @IsUUID() productId: string;

  @IsString() @IsOptional() shade?: string;
  @IsString() @IsOptional() color?: string;
  @IsString() @IsOptional() volume?: string;

  @IsNumber() @Min(0) price: number;

  @IsNumber() @Min(0) stockQuantity: number;
}
