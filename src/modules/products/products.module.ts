import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.entity';
import { BrandModule } from '../brand/brand.module';
import { SubcategoryModule } from '../subcategory/subcategory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    BrandModule,
    SubcategoryModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
