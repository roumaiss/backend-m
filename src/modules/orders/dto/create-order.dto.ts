import { IsNumber, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class CreateOrderDto {
  @IsUUID() userId: string;

  @IsNumber() @Min(0) totalAmount: number;

  @IsString() @MinLength(1) shippingAddress: string;
}
