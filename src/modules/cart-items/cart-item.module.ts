import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { CartItem } from './cart-item.entity';
import { CartModule } from '../cart/cart.module';
import { ProductVariantModule } from '../product-variants/product-variant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem]),
    CartModule,
    ProductVariantModule,
  ],
  controllers: [CartItemController],
  providers: [CartItemService],
  exports: [CartItemService],
})
export class CartItemModule {}
