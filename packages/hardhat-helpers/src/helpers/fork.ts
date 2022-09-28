import { THardhatRuntimeEnvironmentExtended } from './types/THardhatRuntimeEnvironmentExtended';

import { NETWORKS_INFO, NetworkName, providers, NetworkConfig } from '@hovoh/evmcontractsregistry';

let currentChainId: number | null = null;
let atBlock: number | null = null;

export const getChainId = (hre: THardhatRuntimeEnvironmentExtended): number => {
  if (currentChainId != null) {
    return currentChainId;
  } else if (hre.network.config.chainId != null) {
    return hre.network.config.chainId;
  }
  throw new Error('Cannot find what chain we are interacting with');
};

export const getForkedAtBlock = (): number => {
  return atBlock ?? 0;
};

export const fork = async (networkName: NetworkName, blockNumber: number, hre: THardhatRuntimeEnvironmentExtended): Promise<NetworkConfig> => {
  const chain = NETWORKS_INFO[networkName];
  currentChainId = chain.chainId;
  atBlock = blockNumber;
  await hre.network.provider.request({
    method: 'hardhat_reset',
    params: [
      {
        forking: {
          jsonRpcUrl: providers.getUrl(chain.chainId),
          blockNumber,
        },
      },
    ],
  });
  return chain;
};
