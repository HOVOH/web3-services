import { DeployFunction } from 'hardhat-deploy/dist/types';

import { PRICE_PROVIDER_DID } from '../100_deployPriceProvider';
import { GOHM_ORACLE_DID } from '../200_deployGOHMPriceOracle';

import { configTokenOracleFactory } from './configOracles';

import { getContractAddress, Tokens } from '~common/config';

export const CONFIG_GOHM_ORACLE = 'pp_config_gohm';

const configGohmPP: DeployFunction = configTokenOracleFactory(async (xhre) => {
  const gohmOracle = await xhre.deployments.get(GOHM_ORACLE_DID);
  const tokenAddress = getContractAddress(Tokens.GOHM, xhre.network.config.chainId);
  return { token: tokenAddress, oracle: gohmOracle.address };
});

export default configGohmPP;
configGohmPP.id = CONFIG_GOHM_ORACLE;
configGohmPP.tags = ['oracle', CONFIG_GOHM_ORACLE];
configGohmPP.dependencies = [GOHM_ORACLE_DID, PRICE_PROVIDER_DID];
