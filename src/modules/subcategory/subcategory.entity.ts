import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('subcategories')
export class Subcategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
