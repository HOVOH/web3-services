import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './entities/asset.entity';
import { EvmService } from '../evm/evm.service';
import { PriceSource } from './entities/price-source.entity';
import { PriceMonitor } from './price-monitor.service';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset)
    private assets: Repository<Asset>,
    @InjectRepository(PriceSource)
    private priceSources: Repository<PriceSource>,
    private evmService: EvmService,
    private priceMonitor: PriceMonitor,
  ) {}

  async registerAsset(address: string, chainId: number) {
    try {
      const asset = new Asset();
      asset.address = address;
      asset.chainId = chainId;
      const erc20 = this.evmService.erc20(chainId, address);
      await erc20.symbol();
      const [decimals, symbol, name] = await this.evmService
        .multicall(chainId)
        .all([
          erc20.multiCall.decimals(),
          erc20.multiCall.symbol(),
          erc20.multiCall.name(),
        ]);
      asset.decimals = decimals;
      asset.symbol = symbol;
      asset.name = name;
      return await this.assets.save(asset);
    } catch (error) {
      if (!error.message.includes('duplicate')) {
        console.log(error);
      }
    }
    return this.getAsset(address, chainId);
  }

  async getAsset(address: string, chainId: number) {
    return await this.assets.findOneBy({ address, chainId });
  }

  async getPriceSource(priceSource: Partial<PriceSource>) {
    const found = await this.priceSources.findOne({
      where: {
        address: priceSource.address,
        chainId: priceSource.chainId,
        type: priceSource.type,
        assetId: priceSource.assetId,
      },
    });
    if (found) {
      return found;
    }
    return this.priceSources.save(priceSource);
  }

  async monitorPriceSource(priceSourceInfo: Partial<PriceSource>) {
    const priceSource = await this.getPriceSource(priceSourceInfo);
    await this.priceMonitor.monitor(priceSource);
  }
}
