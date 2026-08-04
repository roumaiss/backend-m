import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @ManyToOne(() => Product, (product: Product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ nullable: true })
  shade: string;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  hexColor: string;

  @Column({ nullable: true })
  volume: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stockQuantity: number;

  get inStock(): boolean {
    return this.stockQuantity > 0;
  }

  toJSON() {
    return { ...this, inStock: this.inStock };
  }
}
