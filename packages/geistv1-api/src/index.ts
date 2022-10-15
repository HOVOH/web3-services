import {
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
} from './generated/aave';
import { PODL__factory } from './generated/geist';

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

const fantomDeployment = {
  ...fullDeployment({
    LendingPoolAddressesProvider: '0x6c793c628Fe2b480c5e6FB7957dDa4b9291F9c9b',
    LendingPoolAddressesProviderRegistry:
      '0x4CF8E50A5ac16731FA2D8D9591E195A285eCaA82',
    LendingPool: '0x9FAD24f572045c7869117160A571B2e50b10d068',
    LendingPoolCollateralManager: '0x0713b9c9872442954ea50a862376ed3a93f66b08',
    LendingRateOracle: '0xFCef135eB981CDD798a2C0Cfd4149ef534fD6eea',
    PriceOracle: '0xC466e3FeE82C6bdc2E17f2eaF2c6F1E91AD10FD3',
    WETHGateway: '0x47102245FEa0F8D35a6b28E54505e9FfD83d0704',
    ProtocolDataProvider: '0xf3B0611e2E4D2cd6aB4bb3e01aDe211c3f42A8C3',
  }),
  PODL: contract(
    '0x0F595677AfC5F4A99Cfa1dDB4a00B8f54Cfda506',
    PODL__factory.connect,
    PODL__factory.multicall
  ),
};

const namedFactories = {};

export interface GeistNetworksContractMap {
  [Network.OPERA_MAINNET]: typeof fantomDeployment;
}

const geistApi = new NetworksContractsRegistry<
  GeistNetworksContractMap,
  typeof namedFactories
>();

geistApi.addNetwork(Network.OPERA_MAINNET, fantomDeployment);
geistApi.setNamedFactories(namedFactories);

export type GeistAPI = ContractFactory<
  GeistNetworksContractMap,
  typeof namedFactories
>;
export type GeistNetworks = keyof GeistNetworksContractMap;

export const initGeistApi = (providers: ProvidersRegistry): GeistAPI => {
  return new ContractFactory(providers, geistApi);
};

export const AVAILABLE_NETWORKS = [Network.OPERA_MAINNET] as const;
