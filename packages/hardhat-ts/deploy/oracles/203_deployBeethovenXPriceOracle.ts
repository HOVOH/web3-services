import { DeployFunction } from 'hardhat-deploy/dist/types';
import { logDeployment } from 'helpers/deployments';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import { getChainId } from '../../test/helpers/fork';

import { ORACLE_TAG, PRICE_PROVIDER_DID } from './100_deployPriceProvider';

import { BeethovenX, getContractAddress } from '~common/config';

export const BEETHOVEN_PRICE_ORACLE_DID = 'balancer_v2_price_oracle';

const deployBeethovenV2PriceOracle: DeployFunction = async ({ deployments, getNamedAccounts }: THardhatRuntimeEnvironmentExtended) => {
  const { deployer } = await getNamedAccounts();
  const priceProvider = await deployments.get(PRICE_PROVIDER_DID);
  const beethovenVault = getContractAddress(BeethovenX.VAULT, getChainId());
  const deployment = await deployments.deploy(BEETHOVEN_PRICE_ORACLE_DID, {
    contract: 'BalV2PriceOracle',
    from: deployer,
    args: [priceProvider.address, beethovenVault, 20 * 60, 60],
  });
  logDeployment(BEETHOVEN_PRICE_ORACLE_DID, deployment, deployments.log);
};
export default deployBeethovenV2PriceOracle;
deployBeethovenV2PriceOracle.id = BEETHOVEN_PRICE_ORACLE_DID;
deployBeethovenV2PriceOracle.tags = [ORACLE_TAG, BEETHOVEN_PRICE_ORACLE_DID];
deployBeethovenV2PriceOracle.dependencies = [PRICE_PROVIDER_DID];
