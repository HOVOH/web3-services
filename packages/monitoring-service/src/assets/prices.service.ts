import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PriceUpdate } from './events/price-update.event';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';
import { PriceSource } from './entities/price-source.entity';

@Injectable()
export class Prices {
  TABLE_NAME = 'price_entries';
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PriceSource)
    private priceSources: Repository<PriceSource>,
  ) {}

  @OnEvent(PriceUpdate.NAME)
  addPrice(priceUpdate: PriceUpdate) {
    console.log(priceUpdate.source.id, ':', priceUpdate.usd_value);
    this.dataSource.query(
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

  async getPrice(asset: Asset, priceSource?: PriceSource) {
    if (!priceSource) {
      priceSource = await this.priceSources
        .createQueryBuilder()
        .where('asset_id == :assetId', { assetId: asset.id })
        .select('usd_value')
        .orderBy('priority', 'DESC')
        .limit(1)
        .getOne();
    }
    return this.dataSource.query(`
      SELECT usd_value FROM ${this.TABLE_NAME} 
      WHERE price_source_id == ${priceSource.id} 
      ORDER BY at DESC 
      LIMIT 1; 
    `);
  }
}
