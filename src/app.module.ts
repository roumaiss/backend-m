import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { validationSchema } from './config/validation.schema';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { BrandModule } from './modules/brand/brand.module';
import { CategoryModule } from './modules/category/category.module';
import { SubcategoryModule } from './modules/subcategory/subcategory.module';
import { ProductsModule } from './modules/products/products.module';
import { ProductVariantModule } from './modules/product-variants/product-variant.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OrderItemModule } from './modules/order-items/order-item.module';
import { CartModule } from './modules/cart/cart.module';
import { CartItemModule } from './modules/cart-items/cart-item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('database.url'),
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),
        autoLoadEntities: true,
      }),
    }),
    UsersModule,
    AuthModule,
    BrandModule,
    CategoryModule,
    SubcategoryModule,
    ProductsModule,
    ProductVariantModule,
    OrdersModule,
    OrderItemModule,
    CartModule,
    CartItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
