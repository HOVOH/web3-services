import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Asset } from './asset.entity';

@Entity()
export class Liquidity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Asset)
  @JoinColumn()
  asset: Promise<Asset>;

  @Column()
  tokens: string;

  @Column()
  weights: string;
}
