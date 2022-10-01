import { Injectable, OnModuleInit } from '@nestjs/common';
import { providers } from '@hovoh/evmcontractsregistry';
import { Provider } from '@ethersproject/providers';
import { Wallet } from 'ethers';
import {
  ERC20,
  initOpenZeppelinAPI,
  OpenZeppelinAPI,
} from '@hovoh/openzeppelin-api';
import { IMulticallProvider } from '@hovoh/ethcall';
import { Asset } from '../assets/entities/asset.entity';
import { AssetService } from '../assets/asset.service';

@Injectable()
export class EvmService implements OnModuleInit {
  ozApi: OpenZeppelinAPI;

  constructor(private assetService: AssetService) {}

  onModuleInit(): any {
    this.ozApi = initOpenZeppelinAPI(this.getProviders());
  }

  getProviders() {
    return providers;
  }

  getProvider(chainId: number): Provider | Wallet {
    return providers.forNetwork(chainId);
  }

  erc20(chainId: number, address: string) {
    return this.ozApi.forNetwork(chainId).getContractInstance('ERC20', address);
  }

  multicall(chainId: number): IMulticallProvider {
    return this.getProviders().multicallForNetwork(chainId);
  }

  async registerAsset(chainId: number, address: string) {
    const asset = new Asset();
    asset.address = address;
    asset.chainId = chainId;
    const erc20 = this.erc20(chainId, address);
    const [decimals, symbol, name] = await this.multicall(chainId).all([
      erc20.multiCall.decimals(),
      erc20.multiCall.symbol(),
      erc20.multiCall.name(),
    ]);
    asset.decimals = decimals;
    asset.symbol = symbol;
    asset.name = name;
    return this.assetService.registerAsset(asset);
  }
}
