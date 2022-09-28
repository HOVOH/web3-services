import { Signer } from 'ethers';

import { THardhatRuntimeEnvironmentExtended } from './types/THardhatRuntimeEnvironmentExtended';
import { Provider } from '@ethersproject/abstract-provider';
import {Deployment} from "hardhat-deploy/dist/types";

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

export interface Deployments {
  [deployment: string]: Deployment
}

export function connectFactory<T extends ConnectMap>(connectMap: T) {
  return async <K extends keyof T>(
    deploymentName: K, 
    hre: THardhatRuntimeEnvironmentExtended,
    deployments?: Deployments) => {
    let deployment: Deployment;
    if (deployments){
      console.log("Overriding deployments")
      deployment = deployments[deploymentName as string];
    } else {
      deployment = await hre.deployments.get(deploymentName as string);
    }
    const { deployer } = await hre.getNamedAccounts();
    return await (connectMap[deploymentName](
      deployment.address,
      await hre.ethers.getSigner(deployer)
    ) as unknown as Promise<ReturnType<T[K]>>);
  };
}


