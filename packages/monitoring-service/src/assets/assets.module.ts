import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';
import { EvmModule } from '../evm/evm.module';
import { AssetService } from './asset.service';
import { PriceSource } from './entities/price-source.entity';
import { PriceMonitor } from './price-monitor.service';
import { Prices } from './prices.service';
import { Liquidity } from './entities/liquidity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset, PriceSource, Liquidity]),
    EvmModule,
  ],
  providers: [AssetService, PriceMonitor, Prices],
  exports: [AssetService],
})
export class AssetsModule {}
