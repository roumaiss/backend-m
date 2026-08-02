import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Subcategory } from '../subcategory/subcategory.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(
    () => Subcategory,
    (subcategory: Subcategory) => subcategory.category,
  )
  subcategories: Subcategory[];
}
