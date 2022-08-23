import { DeployFunction } from 'hardhat-deploy/dist/types';
import { logDeployment } from 'helpers/deployments';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import { ORACLE_TAG, PRICE_PROVIDER_DID } from './100_deployPriceProvider';

export const BAL_LP_PRICE_ORACLE_DID = 'balancer_v2_lp_price_oracle';

const deployBeethovenV2PriceOracle: DeployFunction = async ({ deployments, getNamedAccounts }: THardhatRuntimeEnvironmentExtended) => {
  const { deployer } = await getNamedAccounts();
  const priceProvider = await deployments.get(PRICE_PROVIDER_DID);
  const deployment = await deployments.deploy(BAL_LP_PRICE_ORACLE_DID, {
    contract: 'BalV2WeightedPoolLPPriceOracle',
    from: deployer,
    args: [priceProvider.address],
  });
  logDeployment(BAL_LP_PRICE_ORACLE_DID, deployment, deployments.log);
};
export default deployBeethovenV2PriceOracle;
deployBeethovenV2PriceOracle.id = BAL_LP_PRICE_ORACLE_DID;
deployBeethovenV2PriceOracle.tags = [ORACLE_TAG, BAL_LP_PRICE_ORACLE_DID];
deployBeethovenV2PriceOracle.dependencies = [PRICE_PROVIDER_DID];
