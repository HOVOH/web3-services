import { DeployFunction } from 'hardhat-deploy/dist/types';
import { logDeployment } from 'helpers/deployments';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import { ORACLE_TAG, PRICE_PROVIDER_DID } from './100_deployPriceProvider';

export const UNISWAPV2_LP_PRICE_ORACLE_DID = 'uniswapv2_lp_price_oracle';

const deployUniswapV2LPPriceOracle: DeployFunction = async ({ deployments, getNamedAccounts }: THardhatRuntimeEnvironmentExtended) => {
  const { deployer } = await getNamedAccounts();
  const priceProvider = await deployments.get(PRICE_PROVIDER_DID);
  const deployment = await deployments.deploy(UNISWAPV2_LP_PRICE_ORACLE_DID, {
    contract: 'UniswapV2LPPriceOracle',
    from: deployer,
    args: [priceProvider.address],
  });
  logDeployment(UNISWAPV2_LP_PRICE_ORACLE_DID, deployment, deployments.log);
};
export default deployUniswapV2LPPriceOracle;
deployUniswapV2LPPriceOracle.id = UNISWAPV2_LP_PRICE_ORACLE_DID;
deployUniswapV2LPPriceOracle.tags = [ORACLE_TAG, UNISWAPV2_LP_PRICE_ORACLE_DID];
