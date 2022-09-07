import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { OlympusProService } from './olympus-pro.service';
import { PricePollingService } from '../assets/price-polling.service';
import { PriceMonitor } from '../assets/price-monitor.service';
import { Cron } from '@nestjs/schedule';
import { PriceUpdate } from '../assets/events/price-update.event';
import { BigNumber } from 'ethers';
import { EvmService } from '../evm/evm.service';
import { PriceSource } from '../assets/entities/price-source.entity';
import { Network } from '@hovoh/evmcontractsregistry';
import { addresses } from '../evm/addresses';

export const PRICE_SOURCE_OP_BOND = 'op_bond';

@Injectable()
export class BondPricePollingService extends PricePollingService {
  constructor(
    private api: OlympusProService,
    priceMonitor: PriceMonitor,
    private evmService: EvmService,
  ) {
    super(PRICE_SOURCE_OP_BOND, priceMonitor);
  }

  @Cron('59 * * * * *')
  async poll() {
    for (const [network, feeds] of Object.entries(this.feedsPerNetwork)) {
      const prices = await this.api
        .forNetwork(Number(network))
        .multiCall((getContract) =>
          feeds.map((feed) =>
            getContract('CustomBond', feed.priceSource.address).bondPrice(),
          ),
        );
      // Prices are returned with 8 decimals based in the principal token,
      // we will convert to the principal's decimals
      const denominators = await Promise.all(
        feeds.map((feed) => feed.priceSource.denominator),
      );
      const events = prices.map((price, i) => {
        const adjustedPrice = price
          .mul(BigNumber.from(10).pow(denominators[i].decimals))
          .div(BigNumber.from(10).pow(7));
        return new PriceUpdate(feeds[i].priceSource, new Date(), adjustedPrice);
      });
      events.forEach((event, i) => feeds[i].eventHandler(event));
    }
  }

  async registerBond(
    chainId: number,
    redeemedAddress: string,
    principalAddress: string,
    bondAddress: string,
    enabled = false,
  ) {
    const redeemed = await this.evmService.registerAsset(
      chainId,
      redeemedAddress,
    );
    const principal = await this.evmService.registerAsset(
      chainId,
      principalAddress,
    );
    const priceSource = new PriceSource();
    priceSource.type = PRICE_SOURCE_OP_BOND;
    priceSource.chainId = chainId;
    priceSource.address = bondAddress;
    priceSource.assetId = redeemed.id;
    priceSource.denominatorId = principal.id;
    priceSource.priority = 0;
    priceSource.label = `${redeemed.symbol}/${principal.symbol}`;
    priceSource.enabled = enabled;
    return await this.priceMonitor.registerPriceSource(priceSource);
  }

  async onModuleInit(): Promise<any> {
    await super.onModuleInit();
    await this.registerDefaults();
  }

  async registerDefaults() {
    await this.registerBond(
      Network.ARBITRUM,
      addresses[Network.ARBITRUM].GMX,
      addresses[Network.ARBITRUM].WETH,
      this.api.forNetwork(Network.ARBITRUM).getContract('WETHGMX').address,
      true,
    );
  }
}
