import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from './product-variant.entity';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly repo: Repository<ProductVariant>,
    private readonly productsService: ProductsService,
  ) {}

  async create(dto: CreateProductVariantDto): Promise<ProductVariant> {
    await this.productsService.findByIdOrFail(dto.productId);
    const variant = this.repo.create(dto);
    return this.repo.save(variant);
  }

  findAll(): Promise<ProductVariant[]> {
    return this.repo.find({ relations: { product: true } });
  }

  findByProduct(productId: string): Promise<ProductVariant[]> {
    return this.repo.find({ where: { productId } });
  }

  findById(id: string): Promise<ProductVariant | null> {
    return this.repo.findOne({
      where: { id },
      relations: { product: true },
    });
  }

  async findByIdOrFail(id: string): Promise<ProductVariant> {
    const variant = await this.findById(id);
    if (!variant) throw new NotFoundException('Product variant not found');
    return variant;
  }

  async update(
    id: string,
    dto: Partial<CreateProductVariantDto>,
  ): Promise<ProductVariant> {
    await this.findByIdOrFail(id);
    if (dto.productId) {
      await this.productsService.findByIdOrFail(dto.productId);
    }
    await this.repo.update(id, dto);
    return this.findByIdOrFail(id);
  }

  async remove(id: string): Promise<void> {
    await this.findByIdOrFail(id);
    await this.repo.delete(id);
  }
}
