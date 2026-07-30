import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsUUID() cartId: string;
  @IsUUID() productVariantId: string;

  @IsNumber() @Min(1) quantity: number;
}
