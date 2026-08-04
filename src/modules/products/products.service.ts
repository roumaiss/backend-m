import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import {
  PaginatedProductResponse,
  ProductResponse,
} from './dto/product-response.dto';
import { BrandService } from '../brand/brand.service';
import { SubcategoryService } from '../subcategory/subcategory.service';

const PRODUCT_RELATIONS = {
  brand: true,
  subcategory: { category: true },
  variants: true,
} as const;

const PRODUCT_SELECT = {
  id: true,
  name: true,
  description: true,
  images: true,
  primaryImage: true,
  type: true,
  brand: { name: true },
  subcategory: { name: true, category: { name: true } },
} as const;

function toProductResponse(product: Product): ProductResponse {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    images: product.images,
    primaryImage: product.primaryImage,
    type: product.type,
    brand: product.brand.name,
    subcategory: {
      name: product.subcategory.name,
      category: product.subcategory.category.name,
    },
    variants: product.variants.map((variant) => ({
      id: variant.id,
      shade: variant.shade,
      color: variant.color,
      hexColor: variant.hexColor,
      volume: variant.volume,
      price: variant.price as unknown as string,
      stockQuantity: variant.stockQuantity,
      inStock: variant.inStock,
    })),
  };
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
    private readonly brandService: BrandService,
    private readonly subcategoryService: SubcategoryService,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductResponse> {
    await this.brandService.findByIdOrFail(dto.brandId);
    await this.subcategoryService.findByIdOrFail(dto.subcategoryId);
    const product = await this.repo.save(this.repo.create(dto));
    return this.findByIdOrFail(product.id);
  }

  async findAll(
    categoryId?: string,
    page = 1,
    limit = 10,
  ): Promise<PaginatedProductResponse> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);

    const [products, total] = await this.repo.findAndCount({
      where: categoryId ? { subcategory: { categoryId } } : {},
      relations: PRODUCT_RELATIONS,
      select: PRODUCT_SELECT,
      order: { name: 'ASC' },
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
    });

    return {
      data: products.map(toProductResponse),
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async findById(id: string): Promise<ProductResponse | null> {
    const product = await this.repo.findOne({
      where: { id },
      relations: PRODUCT_RELATIONS,
      select: PRODUCT_SELECT,
    });
    return product ? toProductResponse(product) : null;
  }

  async findByIdOrFail(id: string): Promise<ProductResponse> {
    const product = await this.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(
    id: string,
    dto: Partial<CreateProductDto>,
  ): Promise<ProductResponse> {
    if (!(await this.repo.exists({ where: { id } }))) {
      throw new NotFoundException('Product not found');
    }
    if (dto.brandId) await this.brandService.findByIdOrFail(dto.brandId);
    if (dto.subcategoryId) {
      await this.subcategoryService.findByIdOrFail(dto.subcategoryId);
    }
    await this.repo.update(id, dto);
    return this.findByIdOrFail(id);
  }

  async remove(id: string): Promise<void> {
    if (!(await this.repo.exists({ where: { id } }))) {
      throw new NotFoundException('Product not found');
    }
    await this.repo.delete(id);
  }
}
