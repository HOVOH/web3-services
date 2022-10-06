import { Injectable } from '@nestjs/common';
import { ChainlinkService } from './chainlink.service';
import { PriceSource } from '../../assets/entities/price-source.entity';
import { Cron } from '@nestjs/schedule';
import { PriceUpdate } from '../../assets/events/price-update.event';
import {
  DEFAULT_PRIORITY,
  PriceMonitor,
} from '../../assets/price-monitor.service';
import { Network } from '@hovoh/evmcontractsregistry';
import { addresses } from '../addresses';
import { EvmService } from '../evm.service';
import { PricePollingService } from '../../assets/price-polling.service';

export const PRICE_SOURCE_CHAINLINK_POLLING = 'cl_polling';

@Injectable()
export class ChainlinkPollingService extends PricePollingService {
  constructor(
    private chainlinkService: ChainlinkService,
    private evmService: EvmService,
    priceMonitor: PriceMonitor,
  ) {
    super(PRICE_SOURCE_CHAINLINK_POLLING, priceMonitor);
  }

  @Cron('59 * * * * *')
  async poll() {
    for (const [network, feeds] of Object.entries(this.feedsPerNetwork)) {
      const latestRounds = await this.chainlinkService.api
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

  async onModuleInit(): Promise<any> {
    super.onModuleInit();
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
      Network.AVALANCHE_MAINNET,
      addresses[Network.AVALANCHE_MAINNET].WAVAX,
      this.chainlinkService.api
        .forNetwork(Network.AVALANCHE_MAINNET)
        .getContract('AVAX').address,
      DEFAULT_PRIORITY,
      true,
    );
    await this.registerFeed(
      Network.AVALANCHE_MAINNET,
      addresses[Network.AVALANCHE_MAINNET].WBTC,
      this.chainlinkService.api
        .forNetwork(Network.AVALANCHE_MAINNET)
        .getContract('BTC').address,
      DEFAULT_PRIORITY,
      true,
    );
    await this.registerFeed(
      Network.AVALANCHE_MAINNET,
      addresses[Network.AVALANCHE_MAINNET].WETH,
      this.chainlinkService.api
        .forNetwork(Network.AVALANCHE_MAINNET)
        .getContract('ETH').address,
      DEFAULT_PRIORITY,
      true,
    );
    await this.registerFeed(
      Network.ARBITRUM,
      addresses[Network.ARBITRUM].WBTC,
      this.chainlinkService.api.forNetwork(Network.ARBITRUM).getContract('BTC')
        .address,
      DEFAULT_PRIORITY,
      true,
    );
    await this.registerFeed(
      Network.ARBITRUM,
      addresses[Network.ARBITRUM].WETH,
      this.chainlinkService.api.forNetwork(Network.ARBITRUM).getContract('ETH')
        .address,
      DEFAULT_PRIORITY,
      true,
    );
  }
}
