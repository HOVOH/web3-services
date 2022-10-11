import {
  bindings,
  contract,
  ContractFactory,
  Network,
  NetworksContractsRegistry,
  ProvidersRegistry,
} from '@hovoh/evmcontractsregistry';
import {
  AaveProtocolDataProvider__factory,
  LendingPool__factory,
  LendingPoolAddressesProvider__factory,
  LendingPoolAddressesProviderRegistry__factory,
  LendingPoolCollateralManager__factory,
  LendingRateOracle__factory,
  PriceOracle__factory,
} from './generated';

const fullDeployment = (addresses: {
  LendingPoolAddressesProvider: string;
  LendingPoolAddressesProviderRegistry: string;
  LendingPool: string;
  LendingPoolCollateralManager: string;
  LendingRateOracle: string;
  PriceOracle: string;
  WETHGateway: string;
  ProtocolDataProvider: string;
}) => {
  return {
    LendingPoolAddressesProvider: contract(
      addresses.LendingPoolAddressesProvider,
      LendingPoolAddressesProvider__factory.connect,
      LendingPoolAddressesProvider__factory.multicall
    ),
    LendingPoolAddressesProviderRegistry: contract(
      addresses.LendingPoolAddressesProviderRegistry,
      LendingPoolAddressesProviderRegistry__factory.connect,
      LendingPoolAddressesProviderRegistry__factory.multicall
    ),
    LendingPool: contract(
      addresses.LendingPool,
      LendingPool__factory.connect,
      LendingPool__factory.multicall
    ),
    LendingPoolCollateralManager: contract(
      addresses.LendingPoolCollateralManager,
      LendingPoolCollateralManager__factory.connect,
      LendingPoolCollateralManager__factory.multicall
    ),
    LendingRateOracle: contract(
      addresses.LendingRateOracle,
      LendingRateOracle__factory.connect,
      LendingRateOracle__factory.multicall
    ),
    PriceOracle: contract(
      addresses.PriceOracle,
      PriceOracle__factory.connect,
      PriceOracle__factory.multicall
    ),
    ProtocolDataProvider: contract(
      addresses.ProtocolDataProvider,
      AaveProtocolDataProvider__factory.connect,
      AaveProtocolDataProvider__factory.multicall
    ),
  };
};

const fantomDeployment = fullDeployment({
  LendingPoolAddressesProvider: '0x8b9D58E2Dc5e9b5275b62b1F30b3c0AC87138130',
  LendingPoolAddressesProviderRegistry:
    '0x6D77F7a0e9F8EBE1C0FF2d757FC5a411640309ac',
  LendingPool: '0x7220FFD5Dc173BA3717E47033a01d870f06E5284',
  LendingPoolCollateralManager: '0x7DE3D9D91CbD844c862c731d37a96c024BF25dBB',
  LendingRateOracle: '0x6914F607bb9F7B42c67DbD0A783A7E3FDFaB237b',
  PriceOracle: '0x49afc876A2Bd130eF135d9D6220BD85D3164B446',
  WETHGateway: '0x791f1E2Ba36f99af085DF47EdD62ec9d9b8aaD23',
  ProtocolDataProvider: '0x3132870d08f736505FF13B19199be17629085072',
});

/*const fantomDeployment = {
  LendingPoolAddressesProvider: contract(
    '0x8b9D58E2Dc5e9b5275b62b1F30b3c0AC87138130',
    LendingPoolAddressesProvider__factory.connect,
    LendingPoolAddressesProvider__factory.multicall
  ),
  LendingPoolAddressesProviderRegistry: contract(
    '0x6D77F7a0e9F8EBE1C0FF2d757FC5a411640309ac',
    LendingPoolAddressesProviderRegistry__factory.connect,
    LendingPoolAddressesProviderRegistry__factory.multicall
  ),
  LendingPool: contract(
    '0x7220FFD5Dc173BA3717E47033a01d870f06E5284',
    LendingPool__factory.connect,
    LendingPool__factory.multicall
  ),
  LendingPoolCollateralManager: contract(
    '0x7DE3D9D91CbD844c862c731d37a96c024BF25dBB',
    LendingPoolCollateralManager__factory.connect,
    LendingPoolCollateralManager__factory.multicall
  ),
  LendingRateOracle: contract(
    '0x6914F607bb9F7B42c67DbD0A783A7E3FDFaB237b',
    LendingRateOracle__factory.connect,
    LendingRateOracle__factory.multicall
  ),
  PriceOracle: contract(
    '0x49afc876A2Bd130eF135d9D6220BD85D3164B446',
    PriceOracle__factory.connect,
    PriceOracle__factory.multicall
  ),
  ProtocolDataProvider: contract(
    '0x3132870d08f736505FF13B19199be17629085072',
    AaveProtocolDataProvider__factory.connect,
    AaveProtocolDataProvider__factory.multicall
  ),
};*/

const namedFactories = {};

export interface GranaryNetworksContractMap {
  [Network.OPERA_MAINNET]: typeof fantomDeployment;
}

const granaryApi = new NetworksContractsRegistry<
  GranaryNetworksContractMap,
  typeof namedFactories
>();

granaryApi.addNetwork(Network.OPERA_MAINNET, fantomDeployment);
granaryApi.setNamedFactories(namedFactories);

export type GranaryAPI = ContractFactory<
  GranaryNetworksContractMap,
  typeof namedFactories
>;
export type GranaryNetworks = keyof GranaryNetworksContractMap;

export const initGranaryApi = (providers: ProvidersRegistry): GranaryAPI => {
  return new ContractFactory(providers, granaryApi);
};

export const AVAILABLE_NETWORKS = [Network.OPERA_MAINNET] as const;

export * from './generated';
