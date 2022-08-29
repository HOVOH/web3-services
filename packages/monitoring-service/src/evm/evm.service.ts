import { Injectable, OnModuleInit } from '@nestjs/common';
import { providers } from '@hovoh/evmcontractsregistry';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from 'ethers';
import {
  ERC20,
  initOpenZeppelinAPI,
  OpenZeppelinAPI,
} from '@hovoh/openzeppelin-api';
import { MulticallProvider } from '@hovoh/ethers-multicall/dist/provider';

@Injectable()
export class EvmService implements OnModuleInit {
  ozApi: OpenZeppelinAPI;

  onModuleInit(): any {
    this.ozApi = initOpenZeppelinAPI(this.getProviders());
  }

  getProviders() {
    return providers;
  }

  getProvider(chainId: number): JsonRpcProvider | Wallet {
    return providers.forNetwork(chainId);
  }

  erc20(chainId: number, address: string) {
    return this.ozApi.forNetwork(chainId).getContractInstance('ERC20', address);
  }

  multicall(chainId: number): MulticallProvider {
    return this.getProviders().multicallForNetwork(chainId);
  }
}
