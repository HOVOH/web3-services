import {
  bindings,
  contract,
  ContractFactory,
  Network,
  NetworksContractsRegistry,
  ProvidersRegistry,
} from '@hovoh/evmcontractsregistry';
import { CustomBond__factory } from '../generated';

const bond = (address: string) => {
  return contract(
    address,
    CustomBond__factory.connect,
    CustomBond__factory.multicall
  );
};

const arbitrumMainnetContracts = {
  WETHGMX: bond('0xdfb034cd2789b9f85e57d25C69E161eA0bdC8f53'),
};

const mainnetContracts = {
  WETHIQ: bond('0xd208af5393121B41c5D62e25589561748D87a1D8'),
};

const namedFactories = {
  CustomBond: bindings(
    CustomBond__factory.connect,
    CustomBond__factory.multicall
  ),
};

export interface OlympusProNetworksContractMap {
  [Network.ARBITRUM]: typeof arbitrumMainnetContracts;
  [Network.MAINNET]: typeof mainnetContracts;
}

export const olympusProApi = new NetworksContractsRegistry<
  OlympusProNetworksContractMap,
  typeof namedFactories
>();

olympusProApi.addNetwork(Network.ARBITRUM, arbitrumMainnetContracts);
olympusProApi.addNetwork(Network.MAINNET, mainnetContracts);
olympusProApi.setNamedFactories(namedFactories);

export type OlympusProAPI = ContractFactory<
  OlympusProNetworksContractMap,
  typeof namedFactories
>;
export type OlympusProNetworks = keyof OlympusProNetworksContractMap;

export const initOlympusProApi = (
  providers: ProvidersRegistry
): OlympusProAPI => {
  return new ContractFactory(providers, olympusProApi);
};

export * from '../generated';
