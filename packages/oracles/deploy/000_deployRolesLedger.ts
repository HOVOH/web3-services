import { parseUnits } from 'ethers/lib/utils';
import { DeployFunction } from 'hardhat-deploy/dist/types';
import { connect } from 'helpers/bindings';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

export const ROLES_LEDGER_DID = 'roles_ledger';

const deployPriceProvider: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { deployer } = await hre.getNamedAccounts();
  const deployment = await hre.deployments.deploy(ROLES_LEDGER_DID, {
    from: deployer,
    contract: 'RolesLedger',
    args: [deployer],
    gasPrice: parseUnits('2', 'gwei'),
  });
  if (deployment.newlyDeployed) {
    const roles = await connect(ROLES_LEDGER_DID, hre);
    await roles.grantRole(await roles.ADMIN(), deployer);
  }
};
export default deployPriceProvider;
deployPriceProvider.id = ROLES_LEDGER_DID;
deployPriceProvider.tags = [ROLES_LEDGER_DID];
