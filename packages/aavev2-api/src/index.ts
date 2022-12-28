import {
  bindings,
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
import { IProvidersRegistry } from '@hovoh/evmcontractsregistry/src/IProvidersRegistry';

const namedFactories = {
  LendingPoolAddressesProvider: bindings(
    LendingPoolAddressesProvider__factory.connect,
    LendingPoolAddressesProvider__factory.multicall
  ),
  LendingPoolAddressesProviderRegistry: bindings(
    LendingPoolAddressesProviderRegistry__factory.connect,
    LendingPoolAddressesProviderRegistry__factory.multicall
  ),
  LendingPool: bindings(
    LendingPool__factory.connect,
    LendingPool__factory.multicall
  ),
  LendingPoolCollateralManager: bindings(
    LendingPoolCollateralManager__factory.connect,
    LendingPoolCollateralManager__factory.multicall
  ),
  LendingRateOracle: bindings(
    LendingRateOracle__factory.connect,
    LendingRateOracle__factory.multicall
  ),
  PriceOracle: bindings(
    PriceOracle__factory.connect,
    PriceOracle__factory.multicall
  ),
  ProtocolDataProvider: bindings(
    AaveProtocolDataProvider__factory.connect,
    AaveProtocolDataProvider__factory.multicall
  ),
};

export interface AaveV2NetworksContractMap {
  [network: number]: {};
}

const aaveV2Api = new NetworksContractsRegistry<
  AaveV2NetworksContractMap,
  typeof namedFactories
>();

aaveV2Api.setNamedFactories(namedFactories);

export type AaveV2API = ContractFactory<
  AaveV2NetworksContractMap,
  typeof namedFactories
>;
export type AaveV2Networks = keyof AaveV2NetworksContractMap;

export const initAaveV2Api = (providers: IProvidersRegistry): AaveV2API => {
  return new ContractFactory(providers, aaveV2Api);
};
