import { DeployFunction } from 'hardhat-deploy/dist/types';
import { logDeployment } from 'helpers/deployments';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import { getChainId } from '../../test/helpers/fork';

import { getBaseToken, ORACLE_TAG } from './100_deployPriceProvider';

import { ChainlinkFeed, getNetworkContractMap } from '~common/config';

export const GOHM_ORACLE_DID = 'gohm_oracle';

const deployGOHMPriceProvider: DeployFunction = async ({ deployments, getNamedAccounts }: THardhatRuntimeEnvironmentExtended) => {
  const { deployer } = await getNamedAccounts();
  const networkContracts = getNetworkContractMap(getChainId());
  const deployment = await deployments.deploy(GOHM_ORACLE_DID, {
    from: deployer,
    contract: 'GOHMPriceOracle',
    args: [networkContracts[ChainlinkFeed.OHM], networkContracts[ChainlinkFeed.OHM_INDEX], networkContracts[ChainlinkFeed.FTM], getBaseToken()],
  });
  logDeployment(GOHM_ORACLE_DID, deployment, deployments.log);
};
export default deployGOHMPriceProvider;
deployGOHMPriceProvider.id = GOHM_ORACLE_DID;
deployGOHMPriceProvider.tags = [ORACLE_TAG, GOHM_ORACLE_DID];
