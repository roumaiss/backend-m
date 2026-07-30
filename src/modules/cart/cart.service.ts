import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly repo: Repository<Cart>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateCartDto): Promise<Cart> {
    await this.usersService.findByIdOrFail(dto.userId);
    const cart = this.repo.create(dto);
    return this.repo.save(cart);
  }

  findAll(): Promise<Cart[]> {
    return this.repo.find({ relations: { user: true } });
  }

  findByUser(userId: string): Promise<Cart | null> {
    return this.repo.findOne({
      where: { userId },
      relations: { items: { productVariant: true } },
    });
  }

  findById(id: string): Promise<Cart | null> {
    return this.repo.findOne({
      where: { id },
      relations: { items: { productVariant: true } },
    });
  }

  async findByIdOrFail(id: string): Promise<Cart> {
    const cart = await this.findById(id);
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  async remove(id: string): Promise<void> {
    await this.findByIdOrFail(id);
    await this.repo.delete(id);
  }
}
