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

const fullDeployment = (addresses: {
  LendingPoolAddressesProvider: string;
  LendingPoolAddressesProviderRegistry: string;
  LendingPool: string;
  LendingPoolCollateralManager: string;
  LendingRateOracle: string;
  PriceOracle: string;
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
  LendingPoolAddressesProvider: '0x3B8569df88A70ECAE31a6bCA1fc3d51BD426189d',
  LendingPoolAddressesProviderRegistry:
    '0x23Df30FE1d2a8C6f4602db382D727561097F899E',
  LendingPool: '0x7FF2520Cd7b76e8C49B5DB51505b842d665f3e9A',
  LendingPoolCollateralManager: '0x64841b1eb0311cf05ed7dfcfb90b469aaa67d451',
  LendingRateOracle: '0x0024a128CB74FF0C93de1261C59E4d04321E9dC0',
  PriceOracle: '0xE84fD77E8B7bB52a71087653a26d6CC6448fb77D',
  ProtocolDataProvider: '0xC06Dc19a4efA1a832F4618Ce383d8cB9c7F4D600',
});

const mainnetDeployment = fullDeployment({
  LendingPoolAddressesProvider: '0xb7499a92fc36e9053a4324aFfae59d333635D9c3',
  LendingPoolAddressesProviderRegistry:
    '0x88f8CCC064bA2D39cF08D57B6e7504a7B6bE8E4e',
  LendingPool: '0xA422CA380bd70EeF876292839222159E41AAEe17',
  LendingPoolCollateralManager: '0x2420EE2Df56f9C61CA70d94fb509A7B3C04Dc19c',
  LendingRateOracle: '0x55Cc38d75197fBD03CEDe8F1588DcFf0f30E36d4',
  PriceOracle: '0x116529C8E3897257762e8fFdD8c0184978f33150',
  ProtocolDataProvider: '0x960993Cb6bA0E8244007a57544A55bDdb52db97e',
});

const namedFactories = {};

export interface GranaryNetworksContractMap {
  [Network.OPERA_MAINNET]: typeof fantomDeployment;
  [Network.MAINNET]: typeof mainnetDeployment;
}

const sturdyApi = new NetworksContractsRegistry<
  GranaryNetworksContractMap,
  typeof namedFactories
>();

sturdyApi.addNetwork(Network.OPERA_MAINNET, fantomDeployment);
sturdyApi.addNetwork(Network.MAINNET, mainnetDeployment);
sturdyApi.setNamedFactories(namedFactories);

export type SturdyAPI = ContractFactory<
  GranaryNetworksContractMap,
  typeof namedFactories
>;
export type SturdyNetworks = keyof GranaryNetworksContractMap;

export const initSturdyApi = (providers: ProvidersRegistry): SturdyAPI => {
  return new ContractFactory(providers, sturdyApi);
};

export const AVAILABLE_NETWORKS = [
  Network.OPERA_MAINNET,
  Network.MAINNET,
] as const;

export * from './generated/aave';
