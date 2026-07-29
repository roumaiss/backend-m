import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';
import { ProductType } from '../product-type.enum';

export class CreateProductDto {
  @IsString() @MinLength(1) name: string;
  @IsString() description: string;

  @IsString() @IsOptional() shade?: string;
  @IsString() @IsOptional() sizeOrVolume?: string;

  @IsNumber() @Min(0) price: number;

  @IsNumber() @Min(0) stockQuantity: number;

  @IsArray() @IsString({ each: true }) images: string[];

  @IsString() primaryImage: string;

  @IsEnum(ProductType) type: ProductType;

  @IsUUID() brandId: string;
  @IsUUID() subcategoryId: string;
}
