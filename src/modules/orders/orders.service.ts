import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly repo: Repository<Order>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    await this.usersService.findByIdOrFail(dto.userId);
    const order = this.repo.create(dto);
    return this.repo.save(order);
  }

  findAll(): Promise<Order[]> {
    return this.repo.find({ relations: { user: true } });
  }

  findByUser(userId: string): Promise<Order[]> {
    return this.repo.find({ where: { userId } });
  }

  findById(id: string): Promise<Order | null> {
    return this.repo.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  async findByIdOrFail(id: string): Promise<Order> {
    const order = await this.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
    await this.findByIdOrFail(id);
    await this.repo.update(id, dto);
    return this.findByIdOrFail(id);
  }

  async remove(id: string): Promise<void> {
    await this.findByIdOrFail(id);
    await this.repo.delete(id);
  }
}
