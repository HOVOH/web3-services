import {
  Injectable,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { PriceSource } from './entities/price-source.entity';
import {
  IPriceSource,
  PriceSourceFactory,
} from './price-listeners/price-source.factory';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PriceUpdate } from './events/price-update.event';
import {
  ChainlinkPriceSource,
  PRICE_SOURCE_TYPE_CHAINLINK,
} from './price-listeners/chainlink-price-listener';
import { EvmService } from '../evm/evm.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChainlinkService } from '../evm/chainlink.service';

@Injectable()
export class PriceMonitor implements OnApplicationBootstrap {
  private readonly currentlyMonitored: { [id: number]: IPriceSource };
  private sourceFactory: PriceSourceFactory;

  constructor(
    private eventEmitter: EventEmitter2,
    private evmService: EvmService,
    private chainlinkService: ChainlinkService,
    @InjectRepository(PriceSource)
    private priceSources: Repository<PriceSource>,
  ) {
    this.currentlyMonitored = {};
    this.sourceFactory = new PriceSourceFactory();
    this.sourceFactory.addAdapter(
      PRICE_SOURCE_TYPE_CHAINLINK,
      (ps) => new ChainlinkPriceSource(ps, chainlinkService),
    );
  }

  async monitor(priceSource: PriceSource) {
    if (this.isAlreadyMonitored(priceSource)) {
      return;
    }
    await this.startPriceSource(priceSource);
  }

  private async startPriceSource(priceSource: PriceSource) {
    const source = this.sourceFactory.buildFor(priceSource);
    await source.start((priceUpdate) => {
      this.eventEmitter.emit(PriceUpdate.NAME, priceUpdate);
    });
    this.currentlyMonitored[priceSource.id] = source;
  }

  isAlreadyMonitored(priceSource: PriceSource) {
    return Boolean(this.currentlyMonitored[priceSource.id]);
  }

  async onApplicationBootstrap(): Promise<any> {
    const enabledPriceSources = await this.priceSources.find({
      where: { enabled: true },
    });
    for (const ps of enabledPriceSources) {
      await this.monitor(ps);
    }
  }
}
