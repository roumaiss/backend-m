import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';

@Controller('cart-items')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post()
  create(@Body() dto: CreateCartItemDto) {
    return this.cartItemService.create(dto);
  }

  @Get()
  findAll(@Query('cartId') cartId?: string) {
    if (cartId) return this.cartItemService.findByCart(cartId);
    return this.cartItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartItemService.findByIdOrFail(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateCartItemDto>) {
    return this.cartItemService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartItemService.remove(id);
  }
}
