import {
  NetworksContractsRegistry,
  bindings,
  ProvidersRegistry,
  ContractFactory,
} from '@hovoh/evmcontractsregistry';
import { UniswapV2Pair__factory } from '../generated';

const namedFactories = {
  Pair: bindings(
    UniswapV2Pair__factory.connect,
    UniswapV2Pair__factory.multicall
  ),
};

export interface UniswapNetworks {
  [chainID: number]: {};
}

const uniswapApi = new NetworksContractsRegistry<
  UniswapNetworks,
  typeof namedFactories
>();

uniswapApi.setNamedFactories(namedFactories);

export type UniswapAPI = ContractFactory<
  UniswapNetworks,
  typeof namedFactories
>;

export const initUniswapAPI = (providers: ProvidersRegistry): UniswapAPI => {
  return new ContractFactory(providers, uniswapApi);
};

export * from '../generated';
