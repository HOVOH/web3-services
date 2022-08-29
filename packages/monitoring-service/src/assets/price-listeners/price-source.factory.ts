import { PriceUpdate } from '../events/price-update.event';
import { PriceSource } from '../entities/price-source.entity';

export interface IPriceSource {
  start(eventHandler: (pu: PriceUpdate) => void): Promise<void>;
  stop(): void;
}

export interface PriceSourceAdapterMap {
  [type: string]: (ps: PriceSource) => IPriceSource;
}

export class PriceSourceFactory {
  private readonly adapterMap: PriceSourceAdapterMap;

  constructor() {
    this.adapterMap = {};
  }

  buildFor(priceSource: PriceSource) {
    return this.adapterMap[priceSource.type](priceSource);
  }

  addAdapter(type: string, factory: (ps: PriceSource) => IPriceSource) {
    this.adapterMap[type] = factory;
  }
}
