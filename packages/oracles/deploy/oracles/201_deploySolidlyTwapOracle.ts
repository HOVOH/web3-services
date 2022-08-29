import { DeployFunction } from 'hardhat-deploy/dist/types';
import { logDeployment } from 'helpers/deployments';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import { ORACLE_TAG, PRICE_PROVIDER_DID } from './100_deployPriceProvider';

export const SOLIDLY_TWAP_ORACLE_DID = 'solidly_oracle';

const deployStrategyWhitelist: DeployFunction = async ({ deployments, getNamedAccounts }: THardhatRuntimeEnvironmentExtended) => {
  const { deployer } = await getNamedAccounts();
  const priceProvider = await deployments.get(PRICE_PROVIDER_DID);
  const deployment = await deployments.deploy(SOLIDLY_TWAP_ORACLE_DID, {
    from: deployer,
    contract: 'SolidlyTWAPOracle',
    args: [priceProvider.address],
  });
  logDeployment(SOLIDLY_TWAP_ORACLE_DID, deployment, deployments.log);
};

export default deployStrategyWhitelist;
deployStrategyWhitelist.id = SOLIDLY_TWAP_ORACLE_DID;
deployStrategyWhitelist.tags = [ORACLE_TAG, SOLIDLY_TWAP_ORACLE_DID];
deployStrategyWhitelist.dependencies = [PRICE_PROVIDER_DID];
