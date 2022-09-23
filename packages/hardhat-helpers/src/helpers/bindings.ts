import { Signer } from 'ethers';

import { THardhatRuntimeEnvironmentExtended } from './types/THardhatRuntimeEnvironmentExtended';
import { Provider } from '@ethersproject/abstract-provider';

export async function bindings<T>(
  deploymentName: string,
  factory: (address: string, provider: Signer) => T,
  hre: THardhatRuntimeEnvironmentExtended
): Promise<T> {
  const ppDeploy = await hre.deployments.get(deploymentName);
  const { deployer } = await hre.getNamedAccounts();
  return factory(ppDeploy.address, await hre.ethers.getSigner(deployer));
}

export interface ConnectMap {
  [k: string]: (address: string, signerOrProvider: Signer | Provider) => any;
}

export type Connect<T extends ConnectMap, K extends keyof T> = (
  key: keyof T,
  hre: THardhatRuntimeEnvironmentExtended
) => Promise<ReturnType<T[K]>>;

export function connectFactory<T extends ConnectMap>(connectMap: T) {
  return async <K extends keyof T>(deploymentName: K, hre: THardhatRuntimeEnvironmentExtended) => {
    const ppDeploy = await hre.deployments.get(deploymentName as string);
    const { deployer } = await hre.getNamedAccounts();
    console.log('Hello there');
    console.log(Object.keys(connectMap));
    console.log(connectMap[deploymentName]);
    return await (connectMap[deploymentName](
      ppDeploy.address,
      await hre.ethers.getSigner(deployer)
    ) as unknown as Promise<ReturnType<T[K]>>);
  };
}
/*export async function connect<T extends Deployments>(
  deploymentName: T,
  hre: THardhatRuntimeEnvironmentExtended
): Promise<ReturnType<DeploymentsType[T]>> {
  const ppDeploy = await hre.deployments.get(deploymentName);
  const { deployer } = await hre.getNamedAccounts();
  return await (deploymentsFactoryMap[deploymentName](
    ppDeploy.address,
    await hre.ethers.getSigner(deployer)
  ) as unknown as Promise<ReturnType<DeploymentsType[T]>>);
}*/
