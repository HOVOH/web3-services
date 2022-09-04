import { Injectable, OnModuleInit } from '@nestjs/common';
import { ChainlinkApi, initChainlinkApi } from '@hovoh/chainlink-api';
import { EvmService } from '../evm.service';
import {
  DEFAULT_PRIORITY,
  PriceMonitor,
} from '../../assets/price-monitor.service';
import {
  ChainlinkPriceSource,
  PRICE_SOURCE_TYPE_CHAINLINK_EVENT,
} from './chainlink-price-listener';

@Injectable()
export class ChainlinkService implements OnModuleInit {
  api: ChainlinkApi;

  constructor(
    private evmService: EvmService,
    private priceMonitor: PriceMonitor,
  ) {}

  onModuleInit(): any {
    this.api = initChainlinkApi(this.evmService.getProviders());
    this.priceMonitor.addAdapter(
      PRICE_SOURCE_TYPE_CHAINLINK_EVENT,
      (ps) => new ChainlinkPriceSource(ps, this),
    );
  }

  forNetwork(networkId: number) {
    return this.api.forNetwork(networkId);
  }
}
