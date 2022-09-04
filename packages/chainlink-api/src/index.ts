import {
  bindings,
  contract,
  ContractFactory,
  Network,
  NetworksContractsRegistry,
  ProvidersRegistry,
} from '@hovoh/evmcontractsregistry';
import {
  AggregatorV3Interface__factory,
  EACAggregatorProxy,
  EACAggregatorProxy__factory,
  AggregatorV3Interface,
} from '../generated';

const proxy = (address: string) => {
  return contract(
    address,
    EACAggregatorProxy__factory.connect,
    EACAggregatorProxy__factory.multicall
  );
};

const avalancheMainnetContracts = {
  AVAX: proxy('0x0A77230d17318075983913bC2145DB16C7366156'),
  AAVE: proxy('0x3CA13391E9fb38a75330fb28f8cc2eB3D9ceceED'),
  BTC: proxy('0x2779D32d5166BAaa2B2b658333bA7e6Ec0C65743'),
  ETH: proxy('0x976B3D034E162d8bD72D6b9C989d545b839003b0'),
};

const namedFactories = {
  AggregatorProxy: bindings(
    EACAggregatorProxy__factory.connect,
    EACAggregatorProxy__factory.multicall
  ),
  AggregatorV3: bindings(
    AggregatorV3Interface__factory.connect,
    AggregatorV3Interface__factory.multicall
  ),
};

export interface ChainlinkNetworksContractMap {
  [Network.AVALANCHE_C_CHAIN]: typeof avalancheMainnetContracts;
  [Network.OPERA_MAIN_NET]: {};
}

const chainlinkApi = new NetworksContractsRegistry<
  ChainlinkNetworksContractMap,
  typeof namedFactories
>();
chainlinkApi.addNetwork(Network.AVALANCHE_C_CHAIN, avalancheMainnetContracts);
chainlinkApi.setNamedFactories(namedFactories);

type ChainlinkApi = ContractFactory<
  ChainlinkNetworksContractMap,
  typeof namedFactories
>;
type ChainlinkNetworks = keyof ChainlinkNetworksContractMap;

export const initChainlinkApi = (
  providers: ProvidersRegistry
): ChainlinkApi => {
  return new ContractFactory(providers, chainlinkApi);
};

export {
  AggregatorV3Interface,
  EACAggregatorProxy,
  ChainlinkApi,
  ChainlinkNetworks,
};
