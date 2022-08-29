import { Injectable, OnModuleInit } from '@nestjs/common';
import { ChainlinkApi, initChainlinkApi } from '@hovoh/chainlink-api';
import { EvmService } from './evm.service';

@Injectable()
export class ChainlinkService implements OnModuleInit {
  api: ChainlinkApi;

  constructor(private evmService: EvmService) {}

  onModuleInit(): any {
    this.api = initChainlinkApi(this.evmService.getProviders());
  }

  forNetwork(networkId: number) {
    return this.api.forNetwork(networkId);
  }
}
