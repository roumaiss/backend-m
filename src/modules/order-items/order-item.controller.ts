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
import { OrderItemService } from './order-item.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';

@Controller('order-items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  create(@Body() dto: CreateOrderItemDto) {
    return this.orderItemService.create(dto);
  }

  @Get()
  findAll(@Query('orderId') orderId?: string) {
    if (orderId) return this.orderItemService.findByOrder(orderId);
    return this.orderItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderItemService.findByIdOrFail(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateOrderItemDto>) {
    return this.orderItemService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderItemService.remove(id);
  }
}
