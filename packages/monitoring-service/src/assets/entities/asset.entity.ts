import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PriceSource } from './price-source.entity';

@Entity()
@Index(['address', 'chainId'], { unique: true })
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: '42',
  })
  address: string;

  @Column({
    type: 'smallint',
  })
  chainId: number;

  @Column({
    type: 'smallint',
    nullable: true,
  })
  decimals: number;

  @Column({ nullable: true })
  symbol: string;

  @Column({ nullable: true })
  name: string;

  @OneToMany(() => PriceSource, (priceSource) => priceSource.asset)
  priceSources: PriceSource[];
}
