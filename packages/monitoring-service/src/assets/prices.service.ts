import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PriceUpdate } from './events/price-update.event';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';
import { PriceSource } from './entities/price-source.entity';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

@Injectable()
export class Prices {
  TABLE_NAME = 'price_entries';
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PriceSource)
    private priceSources: Repository<PriceSource>,
  ) {}

  @OnEvent(PriceUpdate.NAME)
  async addPrice(priceUpdate: PriceUpdate) {
    if (priceUpdate.usd_value < 0) {
      const denom = await priceUpdate.source.denominator;
      const denominatorUsd = await this.getPrice(denom);
      const usdValue = priceUpdate.value
        .mul(denominatorUsd)
        .div(BigNumber.from(10).pow(denom.decimals));
      priceUpdate.usd_value = usdValue.toNumber();
    }
    await this.dataSource.query(
      `INSERT INTO ${this.TABLE_NAME}(price_source_id, at, usd_value, value)
      VALUES (
        ${priceUpdate.source.id}, 
        '${priceUpdate.timestamp.toISOString()}', 
        ${priceUpdate.usd_value}, 
        '${priceUpdate.value.toString()}'
        )
      `,
    );
  }

  async getPrice(
    asset: Pick<Asset, 'id'>,
    priceSource?: PriceSource,
  ): Promise<number> {
    if (!priceSource) {
      priceSource = await this.priceSources
        .find({
          where: {
            assetId: asset.id,
          },
          order: {
            priority: 'DESC',
          },
        })
        .then((sources) => sources[0]);
    }
    return (
      await this.dataSource.query(`
      SELECT usd_value FROM ${this.TABLE_NAME} 
      WHERE price_source_id = ${priceSource.id} 
      ORDER BY at DESC 
      LIMIT 1; 
    `)
    )[0]['usd_value'];
  }
}
