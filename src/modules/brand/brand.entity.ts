import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('brands')
export class brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  image: string;
}
