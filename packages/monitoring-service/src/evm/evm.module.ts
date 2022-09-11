import { Module } from '@nestjs/common';
import { EvmService } from './evm.service';
import { ChainlinkService } from './chainlink/chainlink.service';
import { ChainlinkPollingService } from './chainlink/chainlink-polling-service';
import { AssetsModule } from '../assets/assets.module';

@Module({
  imports: [AssetsModule],
  providers: [EvmService, ChainlinkService, ChainlinkPollingService],
  exports: [EvmService, ChainlinkService],
})
export class EvmModule {}
