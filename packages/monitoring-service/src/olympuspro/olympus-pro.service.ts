import { EvmService } from '../evm/evm.service';
import { Injectable } from '@nestjs/common';
import { OlympusProAPI, initOlympusProApi } from '@hovoh/olympuspro-api';
import { Network } from '@hovoh/evmcontractsregistry';

@Injectable()
export class OlympusProService {
  api: OlympusProAPI;
  constructor(evmService: EvmService) {
    this.api = initOlympusProApi(evmService.getProviders());
  }

  forNetwork<T>(network: T) {
    return this.api.forNetwork(network as Network.ARBITRUM);
  }
}
