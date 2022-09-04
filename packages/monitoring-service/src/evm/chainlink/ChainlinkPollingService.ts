import {
  Injectable,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { ChainlinkService } from './chainlink.service';
import { PriceSource } from '../../assets/entities/price-source.entity';
import { Cron } from '@nestjs/schedule';
import { PriceUpdate } from '../../assets/events/price-update.event';
import { IPriceSourceAdapter } from '../../assets/price-source.factory';
import {
  DEFAULT_PRIORITY,
  PriceMonitor,
} from '../../assets/price-monitor.service';
import { Network } from '@hovoh/evmcontractsregistry';
import { addresses } from '../addresses';
import { EvmService } from '../evm.service';

export const PRICE_SOURCE_CHAINLINK_POLLING = 'cl_polling';

interface Feed {
  priceSource: PriceSource;
  eventHandler: (pu: PriceUpdate) => void;
}

@Injectable()
export class ChainlinkPollingService
  implements OnModuleInit, OnApplicationBootstrap
{
  feedsPerNetwork: { [chainId: number]: Feed[] };

  constructor(
    private chainlinkService: ChainlinkService,
    private evmService: EvmService,
    private priceMonitor: PriceMonitor,
  ) {
    this.feedsPerNetwork = [];
  }

  onModuleInit(): any {
    this.priceMonitor.addAdapter(PRICE_SOURCE_CHAINLINK_POLLING, (ps) =>
      this.prepare(ps),
    );
  }

  prepare(priceSource: PriceSource): IPriceSourceAdapter {
    if (priceSource.type !== PRICE_SOURCE_CHAINLINK_POLLING) {
      throw new Error(
        `${priceSource.type} cannot be added to chainlink polling`,
      );
    }
    if (!this.feedsPerNetwork[priceSource.chainId]) {
      this.feedsPerNetwork[priceSource.chainId] = [];
    }
    return {
      start: (eventHandler: (pu: PriceUpdate) => void) =>
        this.start(priceSource, eventHandler),
      stop: () => this.stop(priceSource),
    };
  }

  async start(
    priceSource: PriceSource,
    eventHandler: (pu: PriceUpdate) => void,
  ) {
    this.feedsPerNetwork[priceSource.chainId].push({
      priceSource,
      eventHandler,
    });
  }

  async stop(priceSource: PriceSource) {
    this.feedsPerNetwork[priceSource.chainId] = this.feedsPerNetwork[
      priceSource.chainId
    ].filter((feed) => feed.priceSource.id !== priceSource.id);
  }

  @Cron('59 * * * * *')
  async poll() {
    for (const [network, feeds] of Object.entries(this.feedsPerNetwork)) {
      const latestRounds = await this.chainlinkService
        .forNetwork(Number(network))
        .multiCall((getContract) =>
          feeds.map((feed) =>
            getContract(
              'AggregatorProxy',
              feed.priceSource.address,
            ).latestRoundData(),
          ),
        );
      const prices = latestRounds.map((data) => data.answer);
      const events = prices.map(
        (price, i) =>
          new PriceUpdate(
            feeds[i].priceSource,
            new Date(),
            price,
            price.div(100).toNumber(),
          ),
      );
      events.forEach((event, i) => feeds[i].eventHandler(event));
    }
  }

  async onApplicationBootstrap(): Promise<any> {
    await this.registerDefaults();
  }

  async registerFeed(
    chainId: number,
    assetAddress: string,
    feedAddress: string,
    priority = DEFAULT_PRIORITY,
    enabled = false,
  ) {
    const asset = await this.evmService.registerAsset(chainId, assetAddress);
    const priceSource = new PriceSource();
    priceSource.address = feedAddress;
    priceSource.chainId = chainId;
    priceSource.type = PRICE_SOURCE_CHAINLINK_POLLING;
    priceSource.assetId = asset.id;
    priceSource.priority = priority;
    priceSource.label = `${asset.symbol}/USD`;
    priceSource.enabled = enabled;
    return await this.priceMonitor.registerPriceSource(priceSource);
  }

  private async registerDefaults() {
    await this.registerFeed(
      Network.AVALANCHE_C_CHAIN,
      addresses[Network.AVALANCHE_C_CHAIN].WAVAX,
      this.chainlinkService.api
        .forNetwork(Network.AVALANCHE_C_CHAIN)
        .getContract('AVAX').address,
      DEFAULT_PRIORITY,
      true,
    );
    await this.registerFeed(
      Network.AVALANCHE_C_CHAIN,
      addresses[Network.AVALANCHE_C_CHAIN].WBTC,
      this.chainlinkService.api
        .forNetwork(Network.AVALANCHE_C_CHAIN)
        .getContract('BTC').address,
      DEFAULT_PRIORITY,
      true,
    );
    await this.registerFeed(
      Network.AVALANCHE_C_CHAIN,
      addresses[Network.AVALANCHE_C_CHAIN].WETH,
      this.chainlinkService.api
        .forNetwork(Network.AVALANCHE_C_CHAIN)
        .getContract('ETH').address,
      DEFAULT_PRIORITY,
      true,
    );
  }
}
