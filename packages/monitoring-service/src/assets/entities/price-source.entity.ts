import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Asset } from './asset.entity';

@Entity()
@Index(['address', 'asset', 'chainId'], { unique: true })
export class PriceSource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: '42',
    nullable: true,
  })
  address: string;

  @Column()
  chainId: number;

  @Column()
  type: string;

  @ManyToOne(() => Asset, (asset) => asset.priceSources)
  @JoinColumn()
  asset: Promise<Asset>;

  @Column()
  assetId: number;

  @OneToOne(() => Asset)
  @JoinColumn()
  denominator?: Promise<Asset>;

  @Column({ nullable: true })
  denominatorId?: number;

  @Column({ default: 0 })
  priority: number;

  @Column({ default: false })
  enabled: boolean;

  @Column({ nullable: true })
  label?: string;
}
