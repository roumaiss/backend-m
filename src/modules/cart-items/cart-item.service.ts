import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { CartService } from '../cart/cart.service';
import { ProductVariantService } from '../product-variants/product-variant.service';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly repo: Repository<CartItem>,
    private readonly cartService: CartService,
    private readonly productVariantService: ProductVariantService,
  ) {}

  async create(dto: CreateCartItemDto): Promise<CartItem> {
    await this.cartService.findByIdOrFail(dto.cartId);
    await this.productVariantService.findByIdOrFail(dto.productVariantId);
    const cartItem = this.repo.create(dto);
    return this.repo.save(cartItem);
  }

  findAll(): Promise<CartItem[]> {
    return this.repo.find({
      relations: { cart: true, productVariant: true },
    });
  }

  findByCart(cartId: string): Promise<CartItem[]> {
    return this.repo.find({
      where: { cartId },
      relations: { productVariant: true },
    });
  }

  findById(id: string): Promise<CartItem | null> {
    return this.repo.findOne({
      where: { id },
      relations: { cart: true, productVariant: true },
    });
  }

  async findByIdOrFail(id: string): Promise<CartItem> {
    const cartItem = await this.findById(id);
    if (!cartItem) throw new NotFoundException('Cart item not found');
    return cartItem;
  }

  async update(
    id: string,
    dto: Partial<CreateCartItemDto>,
  ): Promise<CartItem> {
    await this.findByIdOrFail(id);
    if (dto.cartId) await this.cartService.findByIdOrFail(dto.cartId);
    if (dto.productVariantId) {
      await this.productVariantService.findByIdOrFail(dto.productVariantId);
    }
    await this.repo.update(id, dto);
    return this.findByIdOrFail(id);
  }

  async remove(id: string): Promise<void> {
    await this.findByIdOrFail(id);
    await this.repo.delete(id);
  }
}
