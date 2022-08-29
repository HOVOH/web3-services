import { BigNumber } from 'ethers';
import { PriceSource } from '../entities/price-source.entity';
import { IPriceSource } from './price-source.factory';
import { PriceUpdate } from '../events/price-update.event';
import { AggregatorV3Interface } from '@hovoh/chainlink-api';
import { ChainlinkService } from '../../evm/chainlink.service';

export const PRICE_SOURCE_TYPE_CHAINLINK = 'price_source_cl';

export class ChainlinkPriceSource implements IPriceSource {
  private feed: AggregatorV3Interface;

  constructor(
    private priceSource: PriceSource,
    private chainlink: ChainlinkService,
  ) {}

  async start(eventHandler: (pu: PriceUpdate) => void) {
    const proxy = this.chainlink
      .forNetwork(this.priceSource.chainId)
      .getContractInstance('AggregatorProxy', this.priceSource.address);
    this.feed = this.chainlink
      .forNetwork(this.priceSource.chainId)
      .getContractInstance('AggregatorV3', await proxy.aggregator());
    const priceUpdateFilter =
      this.feed.filters['AnswerUpdated(int256,uint256,uint256)']();
    const listener = async (priceUpdate: BigNumber) => {
      const priceUpdateEvent = new PriceUpdate(
        this.priceSource,
        priceUpdate,
        priceUpdate.div(100).toNumber(),
        new Date(),
      );
      eventHandler(priceUpdateEvent);
    };
    this.feed.on(priceUpdateFilter, listener);
  }

  stop() {
    this.feed.removeAllListeners(
      this.feed.filters['AnswerUpdated(int256,uint256,uint256)'](),
    );
  }
}
