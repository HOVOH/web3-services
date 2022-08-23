import { DeployFunction } from 'hardhat-deploy/dist/types';
import { logDeployment } from 'helpers/deployments';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import { getChainId } from '../../test/helpers/fork';
import { ROLES_LEDGER_DID } from '../000_deployRolesLedger';

import { getBaseToken, ORACLE_TAG } from './100_deployPriceProvider';

import { ChainlinkFeed, getContractAddress } from '~common/config';

export const CHAINLINK_PRICE_ORACLE_DID = 'chainlink_price_oracle';

export const baseTokenFeedMap = {
  250: getContractAddress(ChainlinkFeed.FTM, 250),
};

export const getBaseTokenFeed = (chainId: number): string => {
  const id = chainId as keyof typeof baseTokenFeedMap;
  return baseTokenFeedMap[id];
};

const deployChainlinkPriceOracle: DeployFunction = async ({ deployments, getNamedAccounts }: THardhatRuntimeEnvironmentExtended) => {
  const { deployer } = await getNamedAccounts();
  const roles = await deployments.get(ROLES_LEDGER_DID);
  const BASE_TOKEN_FEED = getBaseTokenFeed(getChainId());
  const deployment = await deployments.deploy(CHAINLINK_PRICE_ORACLE_DID, {
    contract: 'ChainlinkPriceOracle',
    from: deployer,
    args: [roles.address, BASE_TOKEN_FEED, getBaseToken()],
  });
  logDeployment(CHAINLINK_PRICE_ORACLE_DID, deployment, deployments.log);
};
export default deployChainlinkPriceOracle;
deployChainlinkPriceOracle.id = CHAINLINK_PRICE_ORACLE_DID;
deployChainlinkPriceOracle.tags = [ORACLE_TAG, CHAINLINK_PRICE_ORACLE_DID];
deployChainlinkPriceOracle.dependencies = [ROLES_LEDGER_DID];
