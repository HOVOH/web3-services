import { DeployFunction } from 'hardhat-deploy/dist/types';
import { logDeployment } from 'helpers/deployments';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import { ORACLE_TAG } from './100_deployPriceProvider';

import { BeethovenX, getContractAddress } from '~common/config';

export const FBEETS_ORACLE_DID = 'fbeets_oracle';

const deployfBeetsPriceOracle: DeployFunction = async ({ deployments, network, getNamedAccounts }: THardhatRuntimeEnvironmentExtended) => {
  const FBEETS_BAR = getContractAddress(BeethovenX.FBEETS_BAR, network.config.chainId);
  const { deployer } = await getNamedAccounts();
  const deployment = await deployments.deploy(FBEETS_ORACLE_DID, {
    contract: 'fBEETSPriceOracle',
    from: deployer,
    args: [FBEETS_BAR],
  });
  logDeployment(FBEETS_ORACLE_DID, deployment, deployments.log);
};
export default deployfBeetsPriceOracle;
deployfBeetsPriceOracle.id = FBEETS_ORACLE_DID;
deployfBeetsPriceOracle.tags = [ORACLE_TAG, FBEETS_ORACLE_DID];
