import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { brand } from '../brand/brand.entity';
import { Subcategory } from '../subcategory/subcategory.entity';
import { ProductVariant } from '../product-variants/product-variant.entity';
import { ProductType } from './product-type.enum';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

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

  @OneToMany(() => ProductVariant, (variant: ProductVariant) => variant.product)
  variants: ProductVariant[];
}
