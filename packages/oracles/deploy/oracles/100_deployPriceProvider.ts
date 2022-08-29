import { DeployFunction } from 'hardhat-deploy/dist/types';
import { logDeployment } from 'helpers/deployments';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import { getChainId } from '../../test/helpers/fork';
import { ROLES_LEDGER_DID } from '../000_deployRolesLedger';

import { getContractAddress, Tokens } from '~common/config';

export const PRICE_PROVIDER_DID = 'price_provider';
export const ORACLE_TAG = 'oracle';

export const PRICE_PROVIDER_DECIMALS = 18;

export const baseTokenMap = {
  250: getContractAddress(Tokens.WFTM, 250),
  31337: '0x0000000000000000000000000000000000000000',
};

export const getBaseToken = (chainId?: number): string => {
  const id = (chainId != null ? chainId : getChainId()) as keyof typeof baseTokenMap;
  return baseTokenMap[id];
};

const deployPriceProvider: DeployFunction = async ({ deployments, getNamedAccounts }: THardhatRuntimeEnvironmentExtended) => {
  const { deployer } = await getNamedAccounts();
  const rolesLedger = await deployments.get(ROLES_LEDGER_DID);
  const BASE_TOKEN = getBaseToken();
  const deployment = await deployments.deploy(PRICE_PROVIDER_DID, {
    from: deployer,
    contract: 'PriceProvider',
    args: [BASE_TOKEN, PRICE_PROVIDER_DECIMALS, rolesLedger.address],
  });
  logDeployment(PRICE_PROVIDER_DID, deployment, deployments.log);
};
export default deployPriceProvider;
deployPriceProvider.id = PRICE_PROVIDER_DID;
deployPriceProvider.tags = [ORACLE_TAG, PRICE_PROVIDER_DID];
deployPriceProvider.dependencies = [ROLES_LEDGER_DID];
