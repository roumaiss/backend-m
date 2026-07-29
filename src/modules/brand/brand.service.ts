import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { brand } from './brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(brand)
    private readonly repo: Repository<brand>,
  ) {}

  create(dto: CreateBrandDto): Promise<brand> {
    const brandEntity = this.repo.create(dto);
    return this.repo.save(brandEntity);
  }

  findAll(): Promise<brand[]> {
    return this.repo.find();
  }

  findById(id: string): Promise<brand | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByIdOrFail(id: string): Promise<brand> {
    const brandEntity = await this.findById(id);
    if (!brandEntity) throw new NotFoundException('Brand not found');
    return brandEntity;
  }

  async update(id: string, dto: Partial<CreateBrandDto>): Promise<brand> {
    await this.findByIdOrFail(id);
    await this.repo.update(id, dto);
    return this.findByIdOrFail(id);
  }

  async remove(id: string): Promise<void> {
    await this.findByIdOrFail(id);
    await this.repo.delete(id);
  }
}
