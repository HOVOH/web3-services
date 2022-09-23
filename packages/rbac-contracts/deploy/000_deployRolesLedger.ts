import { parseUnits } from 'ethers/lib/utils';
import { DeployFunction } from 'hardhat-deploy/dist/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { connect } from '../helpers/bindings';
import { ROLES_LEDGER_DID } from '../helpers/deployments-ids';

const deployPriceProvider: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
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
