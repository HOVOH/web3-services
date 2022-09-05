import {
  Injectable,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { EvmService } from '../evm.service';
import { initUniswapAPI, UniswapAPI } from '@hovoh/uniswapv2-api';
import { initTraderJoeApi } from '@hovoh/traderjoe-api';
import {
  DEFAULT_PRIORITY,
  PriceMonitor,
} from '../../assets/price-monitor.service';
import {
  PRICE_SOURCE_TYPE_UNILPV2_EVENT,
  UniLPV2PriceListener,
} from './UniLPV2-price-listener';
import { PriceSource } from '../../assets/entities/price-source.entity';
import { AssetService } from '../../assets/asset.service';
import { Network } from '@hovoh/evmcontractsregistry';

@Injectable()
export class AmmService implements OnModuleInit, OnApplicationBootstrap {
  uniApi: UniswapAPI;
  traderJoeApie: UniswapAPI;

  constructor(
    private evmService: EvmService,
    private monitorService: PriceMonitor,
  ) {
    this.uniApi = initUniswapAPI(evmService.getProviders());
    this.traderJoeApie = initTraderJoeApi(evmService.getProviders());
  }

  uniLPPair(chaindId: number, address: string) {
    return this.uniApi
      .forNetwork(chaindId)
      .getContractInstance('Pair', address);
  }

  onModuleInit(): any {
    this.monitorService.addAdapter(
      PRICE_SOURCE_TYPE_UNILPV2_EVENT,
      (ps: PriceSource) => new UniLPV2PriceListener(ps, this),
    );
  }

  onApplicationBootstrap(): any {
    this.registerDefaults();
  }

  async registerUniV2Pair(
    chainId: number,
    pairAddress: string,
    priority = DEFAULT_PRIORITY,
  ) {
    const pair = this.uniLPPair(chainId, pairAddress);
    const [token0Address, token1Address] = await this.evmService
      .multicall(chainId)
      .all([pair.multiCall.token0(), pair.multiCall.token1()]);
    await this.evmService.registerAsset(chainId, pairAddress);
    const token0 = await this.evmService.registerAsset(chainId, token0Address);
    const token1 = await this.evmService.registerAsset(chainId, token1Address);
    const priceSource = new PriceSource();
    priceSource.address = pairAddress;
    priceSource.chainId = chainId;
    priceSource.type = PRICE_SOURCE_TYPE_UNILPV2_EVENT;
    priceSource.assetId = token0.id;
    priceSource.denominatorId = token1.id;
    priceSource.priority = priority;
    priceSource.label = `${token1.symbol}/${token0.symbol}`;
    return await this.monitorService.registerPriceSource(priceSource);
  }

  async registerDefaults() {
    await this.registerUniV2Pair(
      Network.AVALANCHE_MAINNET,
      '0x0c91a070f862666bBcce281346BE45766d874D98',
    );
  }
}
