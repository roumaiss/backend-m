import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { brand } from '../brand/brand.entity';
import { Subcategory } from '../subcategory/subcategory.entity';
import { ProductType } from './product-type.enum';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  shade: string;

  @Column({ nullable: true })
  sizeOrVolume: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stockQuantity: number;

  get inStock(): boolean {
    return this.stockQuantity > 0;
  }

  @Column('simple-array')
  images: string[];

  @Column()
  primaryImage: string;

  @Column({ type: 'enum', enum: ProductType })
  type: ProductType;

  @Column()
  brandId: string;

  @ManyToOne(() => brand, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'brandId' })
  brand: brand;

  @Column()
  subcategoryId: string;

  @ManyToOne(() => Subcategory, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'subcategoryId' })
  subcategory: Subcategory;

  toJSON() {
    return { ...this, inStock: this.inStock };
  }
}
