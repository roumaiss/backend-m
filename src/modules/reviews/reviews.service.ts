import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { OrderItem } from '../order-items/order-item.entity';
import { OrderStatus } from '../orders/order-status.enum';

const VERIFIED_PURCHASE_STATUSES = [
  OrderStatus.PAID,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
];

// Only expose safe reviewer fields — User carries passwordHash/refreshTokenHash
// with no global serializer to strip them, so a bare `relations: { user: true }`
// would leak the hashes straight into the response.
const REVIEWER_SELECT = { id: true, name: true } as const;

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly repo: Repository<Review>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  private async hasPurchased(
    userId: string,
    productId: string,
  ): Promise<boolean> {
    const count = await this.orderItemRepo
      .createQueryBuilder('orderItem')
      .innerJoin('orderItem.order', 'order')
      .innerJoin('orderItem.productVariant', 'variant')
      .where('order.userId = :userId', { userId })
      .andWhere('variant.productId = :productId', { productId })
      .andWhere('order.status IN (:...statuses)', {
        statuses: VERIFIED_PURCHASE_STATUSES,
      })
      .getCount();
    return count > 0;
  }

  async create(dto: CreateReviewDto): Promise<Review> {
    await this.usersService.findByIdOrFail(dto.userId);
    await this.productsService.findByIdOrFail(dto.productId);

    const alreadyReviewed = await this.repo.exists({
      where: { userId: dto.userId, productId: dto.productId },
    });
    if (alreadyReviewed) {
      throw new ConflictException('You have already reviewed this product');
    }

    const isVerifiedPurchase = await this.hasPurchased(
      dto.userId,
      dto.productId,
    );

    const review = this.repo.create({ ...dto, isVerifiedPurchase });
    return this.repo.save(review);
  }

  findAll(): Promise<Review[]> {
    return this.repo.find({
      relations: { user: true },
      select: { user: REVIEWER_SELECT },
      order: { createdAt: 'DESC' },
    });
  }

  findByProduct(productId: string): Promise<Review[]> {
    return this.repo.find({
      where: { productId },
      relations: { user: true },
      select: { user: REVIEWER_SELECT },
      order: { createdAt: 'DESC' },
    });
  }

  async findByProductForUser(
    productId: string,
    userId: string,
  ): Promise<{ userReview: Review | null; otherReviews: Review[] }> {
    const reviews = await this.findByProduct(productId);
    const userReview =
      reviews.find((review) => review.userId === userId) ?? null;
    const otherReviews = reviews.filter((review) => review.userId !== userId);
    return { userReview, otherReviews };
  }

  findById(id: string): Promise<Review | null> {
    return this.repo.findOne({
      where: { id },
      relations: { user: true, product: true },
      select: { user: REVIEWER_SELECT },
    });
  }

  async findByIdOrFail(id: string): Promise<Review> {
    const review = await this.findById(id);
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async update(id: string, dto: UpdateReviewDto): Promise<Review> {
    await this.findByIdOrFail(id);
    await this.repo.update(id, dto);
    return this.findByIdOrFail(id);
  }

  async remove(id: string): Promise<void> {
    await this.findByIdOrFail(id);
    await this.repo.delete(id);
  }
}
