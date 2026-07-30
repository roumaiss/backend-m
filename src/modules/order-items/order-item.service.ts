import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { OrdersService } from '../orders/orders.service';
import { ProductVariantService } from '../product-variants/product-variant.service';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly repo: Repository<OrderItem>,
    private readonly ordersService: OrdersService,
    private readonly productVariantService: ProductVariantService,
  ) {}

  async create(dto: CreateOrderItemDto): Promise<OrderItem> {
    await this.ordersService.findByIdOrFail(dto.orderId);
    const variant = await this.productVariantService.findByIdOrFail(
      dto.productVariantId,
    );

    const orderItem = this.repo.create({
      orderId: dto.orderId,
      productVariantId: dto.productVariantId,
      quantity: dto.quantity,
      priceTotal: variant.price * dto.quantity,
    });
    return this.repo.save(orderItem);
  }

  findAll(): Promise<OrderItem[]> {
    return this.repo.find({
      relations: { order: true, productVariant: true },
    });
  }

  findByOrder(orderId: string): Promise<OrderItem[]> {
    return this.repo.find({
      where: { orderId },
      relations: { productVariant: true },
    });
  }

  findById(id: string): Promise<OrderItem | null> {
    return this.repo.findOne({
      where: { id },
      relations: { order: true, productVariant: true },
    });
  }

  async findByIdOrFail(id: string): Promise<OrderItem> {
    const orderItem = await this.findById(id);
    if (!orderItem) throw new NotFoundException('Order item not found');
    return orderItem;
  }

  async update(
    id: string,
    dto: Partial<CreateOrderItemDto>,
  ): Promise<OrderItem> {
    const existing = await this.findByIdOrFail(id);

    if (dto.orderId) await this.ordersService.findByIdOrFail(dto.orderId);

    const variantId = dto.productVariantId ?? existing.productVariantId;
    const quantity = dto.quantity ?? existing.quantity;

    let priceTotal = existing.priceTotal;
    if (dto.productVariantId || dto.quantity) {
      const variant = await this.productVariantService.findByIdOrFail(
        variantId,
      );
      priceTotal = variant.price * quantity;
    }

    await this.repo.update(id, {
      orderId: dto.orderId ?? existing.orderId,
      productVariantId: variantId,
      quantity,
      priceTotal,
    });
    return this.findByIdOrFail(id);
  }

  async remove(id: string): Promise<void> {
    await this.findByIdOrFail(id);
    await this.repo.delete(id);
  }
}
