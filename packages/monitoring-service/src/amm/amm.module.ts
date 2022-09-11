import { Module } from '@nestjs/common';
import { AssetsModule } from '../assets/assets.module';
import { EvmModule } from '../evm/evm.module';
import { AmmService } from './amm.service';
import { AmmCommand } from './amm.command';

@Module({
  imports: [EvmModule, AssetsModule],
  providers: [AmmService, AmmCommand],
  exports: [AmmService],
})
export class AmmModule {}
