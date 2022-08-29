import { Module } from '@nestjs/common';
import { EvmService } from './evm.service';
import { ChainlinkService } from './chainlink.service';

@Module({
  providers: [EvmService, ChainlinkService],
  exports: [EvmService, ChainlinkService],
})
export class EvmModule {}
