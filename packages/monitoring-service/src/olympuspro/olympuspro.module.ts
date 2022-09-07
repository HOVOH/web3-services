import { Module } from '@nestjs/common';
import { EvmModule } from '../evm/evm.module';
import { OlympusProService } from './olympus-pro.service';
import { BondPricePollingService } from './bond-price-polling.service';
import { AssetsModule } from '../assets/assets.module';

@Module({
  imports: [EvmModule, AssetsModule],
  providers: [OlympusProService, BondPricePollingService],
})
export class OlympusproModule {}
