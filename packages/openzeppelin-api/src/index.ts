import {
  NetworksContractsRegistry,
  bindings,
  IProvidersRegistry,
  ContractFactory,
} from '@hovoh/evmcontractsregistry';

import { ERC20, ERC20__factory } from '../generated';

const namedFactories = {
  ERC20: bindings(ERC20__factory.connect, ERC20__factory.multicall),
};

export interface OpenZeppelinNetworks {
  [chainID: number]: {};
}

const openzeppelinApi = new NetworksContractsRegistry<
  OpenZeppelinNetworks,
  typeof namedFactories
>();

openzeppelinApi.setNamedFactories(namedFactories);

type OpenZeppelinAPI = ContractFactory<
  OpenZeppelinNetworks,
  typeof namedFactories
>;

export const initOpenZeppelinAPI = (
  providers: IProvidersRegistry
): OpenZeppelinAPI => {
  return new ContractFactory(providers, openzeppelinApi);
};

export { ERC20__factory, ERC20, OpenZeppelinAPI };
