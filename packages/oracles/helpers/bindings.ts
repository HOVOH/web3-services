import { Signer } from 'ethers';
import {
  BalV2PriceOracle__factory,
  BalV2WeightedPoolLPPriceOracle__factory,
  ChainlinkPriceOracle__factory,
  FBEETSPriceOracle__factory,
  GOHMPriceOracle__factory,
  PriceProvider__factory,
  RolesLedger__factory,
} from 'generated/contract-types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import { ROLES_LEDGER_DID } from '../deploy/000_deployRolesLedger';
import { PRICE_PROVIDER_DID } from '../deploy/oracles/100_deployPriceProvider';
import { GOHM_ORACLE_DID } from '../deploy/oracles/200_deployGOHMPriceOracle';
import { BEETHOVEN_PRICE_ORACLE_DID } from '../deploy/oracles/203_deployBeethovenXPriceOracle';
import { FBEETS_ORACLE_DID } from '../deploy/oracles/204_deployFBEETSOracle';
import { CHAINLINK_PRICE_ORACLE_DID } from '../deploy/oracles/205_deployChainlinkPriceOracle';
import { BAL_LP_PRICE_ORACLE_DID } from '../deploy/oracles/206_deployBalLPPriceOracle';

export async function bindings<T>(
  deploymentName: string,
  factory: (address: string, provider: Signer) => T,
  hre: THardhatRuntimeEnvironmentExtended
): Promise<T> {
  const ppDeploy = await hre.deployments.get(deploymentName);
  const { deployer } = await hre.getNamedAccounts();
  return factory(ppDeploy.address, await hre.ethers.getSigner(deployer));
}

export const deploymentsFactoryMap = {
  [ROLES_LEDGER_DID]: RolesLedger__factory.connect,
  [PRICE_PROVIDER_DID]: PriceProvider__factory.connect,
  [CHAINLINK_PRICE_ORACLE_DID]: ChainlinkPriceOracle__factory.connect,
  [BEETHOVEN_PRICE_ORACLE_DID]: BalV2PriceOracle__factory.connect,
  [BAL_LP_PRICE_ORACLE_DID]: BalV2WeightedPoolLPPriceOracle__factory.connect,
  [GOHM_ORACLE_DID]: GOHMPriceOracle__factory.connect,
  [FBEETS_ORACLE_DID]: FBEETSPriceOracle__factory.connect,
};

type DeploymentsType = typeof deploymentsFactoryMap;
type Deployments = keyof DeploymentsType;

export async function connect<T extends Deployments>(deploymentName: T, hre: THardhatRuntimeEnvironmentExtended): Promise<ReturnType<DeploymentsType[T]>> {
  const ppDeploy = await hre.deployments.get(deploymentName);
  const { deployer } = await hre.getNamedAccounts();
  return await (deploymentsFactoryMap[deploymentName](ppDeploy.address, await hre.ethers.getSigner(deployer)) as unknown as Promise<
    ReturnType<DeploymentsType[T]>
  >);
}
