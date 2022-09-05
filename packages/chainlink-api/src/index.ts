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
  AAVE: proxy('0x3CA13391E9fb38a75330fb28f8cc2eB3D9ceceED'),
  AVAX: proxy('0x0A77230d17318075983913bC2145DB16C7366156'),
  BTC: proxy('0x2779D32d5166BAaa2B2b658333bA7e6Ec0C65743'),
  ETH: proxy('0x976B3D034E162d8bD72D6b9C989d545b839003b0'),
};

const arbitrumMainnetContracts = {
  AAVE: proxy('0x221912ce795669f628c51c69b7d0873eDA9C03bB'),
  BNB: proxy('0x6970460aabF80C5BE983C6b74e5D06dEDCA95D4A'),
  ETH: proxy('0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612'),
  BTC: proxy('0x6ce185860a4963106506C203335A2910413708e9'),
  FRAX: proxy('0x0809E3d38d1B4214958faf06D8b1B1a2b73f2ab8'),
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
  [Network.AVALANCHE_MAINNET]: typeof avalancheMainnetContracts;
  [Network.ARBITRUM]: typeof arbitrumMainnetContracts;
  [Network.OPERA_MAINNET]: {};
}

const chainlinkApi = new NetworksContractsRegistry<
  ChainlinkNetworksContractMap,
  typeof namedFactories
>();
chainlinkApi.addNetwork(Network.AVALANCHE_MAINNET, avalancheMainnetContracts);
chainlinkApi.addNetwork(Network.ARBITRUM, arbitrumMainnetContracts);
chainlinkApi.setNamedFactories(namedFactories);

export type ChainlinkApi = ContractFactory<
  ChainlinkNetworksContractMap,
  typeof namedFactories
>;
export type ChainlinkNetworks = keyof ChainlinkNetworksContractMap;

export const initChainlinkApi = (
  providers: ProvidersRegistry
): ChainlinkApi => {
  return new ContractFactory(providers, chainlinkApi);
};

export * from '../generated';
