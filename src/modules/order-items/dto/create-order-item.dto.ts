import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsUUID() orderId: string;
  @IsUUID() productVariantId: string;

  @IsNumber() @Min(1) quantity: number;
}
