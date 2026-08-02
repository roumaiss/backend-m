import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.repo.create(dto);
    return this.repo.save(category);
  }

  findAll(): Promise<Category[]> {
    return this.repo.find({ relations: { subcategories: true } });
  }

  findById(id: string): Promise<Category | null> {
    return this.repo.findOne({
      where: { id },
      relations: { subcategories: true },
    });
  }

  async findByIdOrFail(id: string): Promise<Category> {
    const category = await this.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, dto: Partial<CreateCategoryDto>): Promise<Category> {
    await this.findByIdOrFail(id);
    await this.repo.update(id, dto);
    return this.findByIdOrFail(id);
  }

  async remove(id: string): Promise<void> {
    await this.findByIdOrFail(id);
    await this.repo.delete(id);
  }
}
