import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PriceEntry {
  @PrimaryGeneratedColumn()
  id: number;
}
