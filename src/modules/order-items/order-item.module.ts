import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { OrderItem } from './order-item.entity';
import { OrdersModule } from '../orders/orders.module';
import { ProductVariantModule } from '../product-variants/product-variant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItem]),
    OrdersModule,
    ProductVariantModule,
  ],
  controllers: [OrderItemController],
  providers: [OrderItemService],
  exports: [OrderItemService],
})
export class OrderItemModule {}
