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

const namedFactories = {
  CustomBond: bindings(
    CustomBond__factory.connect,
    CustomBond__factory.multicall
  ),
};

export interface OlympusProNetworksContractMap {
  [Network.ARBITRUM]: typeof arbitrumMainnetContracts;
}

const olympusProApi = new NetworksContractsRegistry<
  OlympusProNetworksContractMap,
  typeof namedFactories
>();

olympusProApi.addNetwork(Network.ARBITRUM, arbitrumMainnetContracts);
olympusProApi.setNamedFactories(namedFactories);

export type OlympusProAPI = ContractFactory<
  OlympusProNetworksContractMap,
  typeof namedFactories
>;
export type ChainlinkNetworks = keyof OlympusProNetworksContractMap;

export const initOlympusProApi = (
  providers: ProvidersRegistry
): OlympusProAPI => {
  return new ContractFactory(providers, olympusProApi);
};

export * from '../generated';
