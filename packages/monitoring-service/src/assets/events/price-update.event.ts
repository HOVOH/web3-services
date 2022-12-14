import { BigNumber } from 'ethers';
import { PriceSource } from '../entities/price-source.entity';

export class PriceUpdate {
  static NAME = 'price_update';

  constructor(
    public source: PriceSource,
    public timestamp: Date,
    public value: BigNumber,
    public usd_value?: number,
  ) {}
}
