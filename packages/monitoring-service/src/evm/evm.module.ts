import { Module } from '@nestjs/common';
import { EvmService } from './evm.service';
import { ChainlinkService } from './chainlink/chainlink.service';
import { AmmService } from './amm/amm.service';
import { AssetsModule } from '../assets/assets.module';
import { ChainlinkPollingService } from './chainlink/ChainlinkPollingService';

@Module({
  imports: [AssetsModule],
  providers: [
    EvmService,
    ChainlinkService,
    ChainlinkPollingService,
    AmmService,
  ],
  exports: [EvmService, ChainlinkService, AmmService],
})
export class EvmModule {}
