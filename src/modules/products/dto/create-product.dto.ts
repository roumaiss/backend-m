import { IsArray, IsEnum, IsString, IsUUID, MinLength } from 'class-validator';
import { ProductType } from '../product-type.enum';

export class CreateProductDto {
  @IsString() @MinLength(1) name: string;
  @IsString() description: string;

  @IsArray() @IsString({ each: true }) images: string[];

  @IsString() primaryImage: string;

  @IsEnum(ProductType) type: ProductType;

  @IsUUID() brandId: string;
  @IsUUID() categoryId: string;
  @IsUUID() subcategoryId: string;
}
