import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from './subcategory.entity';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { CategoryService } from '../category/category.service';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectRepository(Subcategory)
    private readonly repo: Repository<Subcategory>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(dto: CreateSubcategoryDto): Promise<Subcategory> {
    await this.categoryService.findByIdOrFail(dto.categoryId);
    const subcategory = this.repo.create(dto);
    return this.repo.save(subcategory);
  }

  findAll(): Promise<Subcategory[]> {
    return this.repo.find({ relations: { category: true } });
  }

  findById(id: string): Promise<Subcategory | null> {
    return this.repo.findOne({
      where: { id },
      relations: { category: true },
    });
  }

  async findByIdOrFail(id: string): Promise<Subcategory> {
    const subcategory = await this.findById(id);
    if (!subcategory) throw new NotFoundException('Subcategory not found');
    return subcategory;
  }

  async update(
    id: string,
    dto: Partial<CreateSubcategoryDto>,
  ): Promise<Subcategory> {
    await this.findByIdOrFail(id);
    if (dto.categoryId) {
      await this.categoryService.findByIdOrFail(dto.categoryId);
    }
    await this.repo.update(id, dto);
    return this.findByIdOrFail(id);
  }

  async remove(id: string): Promise<void> {
    await this.findByIdOrFail(id);
    await this.repo.delete(id);
  }
}
