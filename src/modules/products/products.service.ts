import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { BrandService } from '../brand/brand.service';
import { CategoryService } from '../category/category.service';
import { SubcategoryService } from '../subcategory/subcategory.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
    private readonly subcategoryService: SubcategoryService,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    await this.brandService.findByIdOrFail(dto.brandId);
    await this.categoryService.findByIdOrFail(dto.categoryId);
    await this.subcategoryService.findByIdOrFail(dto.subcategoryId);
    const product = this.repo.create(dto);
    return this.repo.save(product);
  }

  findAll(): Promise<Product[]> {
    return this.repo.find({
      relations: {
        brand: true,
        category: true,
        subcategory: true,
        variants: true,
      },
    });
  }

  findById(id: string): Promise<Product | null> {
    return this.repo.findOne({
      where: { id },
      relations: {
        brand: true,
        category: true,
        subcategory: true,
        variants: true,
      },
    });
  }

  async findByIdOrFail(id: string): Promise<Product> {
    const product = await this.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: Partial<CreateProductDto>): Promise<Product> {
    await this.findByIdOrFail(id);
    if (dto.brandId) await this.brandService.findByIdOrFail(dto.brandId);
    if (dto.categoryId) {
      await this.categoryService.findByIdOrFail(dto.categoryId);
    }
    if (dto.subcategoryId) {
      await this.subcategoryService.findByIdOrFail(dto.subcategoryId);
    }
    await this.repo.update(id, dto);
    return this.findByIdOrFail(id);
  }

  async remove(id: string): Promise<void> {
    await this.findByIdOrFail(id);
    await this.repo.delete(id);
  }
}
