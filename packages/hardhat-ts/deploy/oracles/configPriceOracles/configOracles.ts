import { PriceProvider__factory, SolidlyTWAPOracle__factory } from 'generated/contract-types';
import { DeployFunction } from 'hardhat-deploy/dist/types';
import { bindings, connect } from 'helpers/bindings';
import { exec } from 'helpers/deployments';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import { getChainId } from '../../../test/helpers/fork';
import { PRICE_PROVIDER_DID } from '../100_deployPriceProvider';
import { SOLIDLY_TWAP_ORACLE_DID } from '../201_deploySolidlyTwapOracle';
import { BEETHOVEN_PRICE_ORACLE_DID } from '../203_deployBeethovenXPriceOracle';
import { CHAINLINK_PRICE_ORACLE_DID } from '../205_deployChainlinkPriceOracle';

import { NamedContractsMap, getNetworkContractMap } from '~common/config';

type OracleConfig = (xhre: THardhatRuntimeEnvironmentExtended, registry: NamedContractsMap) => Promise<{ token: string; oracle: string }>;

export const configTokenOracleFactory = (oracleConfig: OracleConfig) => {
  return async (xhre: THardhatRuntimeEnvironmentExtended) => await configTokenOracle(xhre, oracleConfig);
};

const configTokenOracle = async (xhre: THardhatRuntimeEnvironmentExtended, configOracle: OracleConfig): Promise<void> => {
  const pp = await bindings(PRICE_PROVIDER_DID, PriceProvider__factory.connect, xhre);
  const registry = getNetworkContractMap(getChainId());
  const config = await configOracle(xhre, registry);
  await exec(async () => await pp.setTokenOracle(config.token, config.oracle));
};

export const configSolidlyOracle = (token: string, lp: string): DeployFunction => {
  const config: DeployFunction = configTokenOracleFactory(async (xhre, registry) => {
    const oracle = await bindings(SOLIDLY_TWAP_ORACLE_DID, SolidlyTWAPOracle__factory.connect, xhre);
    const tokenAddress = registry[token];
    await exec(async () => await oracle.setPair(tokenAddress, lp));
    return { token: tokenAddress, oracle: oracle.address };
  });
  config.dependencies = [PRICE_PROVIDER_DID, SOLIDLY_TWAP_ORACLE_DID];
  return config;
};

export const configChainlinkOracle = (token: string, feed: string): DeployFunction => {
  const config: DeployFunction = configTokenOracleFactory(async (xhre, registry) => {
    const oracle = await connect(CHAINLINK_PRICE_ORACLE_DID, xhre);
    const tokenAddress = registry[token];
    const feedAddress = registry[feed];
    await exec(async () => await oracle.setPriceFeed(tokenAddress, feedAddress));
    return { token: tokenAddress, oracle: oracle.address };
  });
  config.dependencies = [PRICE_PROVIDER_DID, CHAINLINK_PRICE_ORACLE_DID];
  return config;
};

export const configBeethovenOracle = (token: string, pool: string): DeployFunction => {
  const config: DeployFunction = configTokenOracleFactory(async (hre, registry) => {
    const oracle = await connect(BEETHOVEN_PRICE_ORACLE_DID, hre);
    const tokenAddress = registry[token];
    const poolAddress = registry[pool];
    await exec(async () => await oracle.setTokenOracle(tokenAddress, poolAddress));
    return {
      token: tokenAddress,
      oracle: oracle.address,
    };
  });
  config.dependencies = [PRICE_PROVIDER_DID, BEETHOVEN_PRICE_ORACLE_DID];
  return config;
};
