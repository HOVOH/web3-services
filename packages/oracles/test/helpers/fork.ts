import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';
import { TNetworkConfig } from 'helpers/types/TNetworkConfig';

import { NETWORKS } from '~common/constants';
import { TNetworkNames } from '~common/models';

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

export const fork = async (networkName: TNetworkNames, blockNumber: number, hre: THardhatRuntimeEnvironmentExtended): Promise<TNetworkConfig> => {
  const chain = NETWORKS[networkName];
  currentChainId = chain.chainId;
  atBlock = blockNumber;
  await hre.network.provider.request({
    method: 'hardhat_reset',
    params: [
      {
        forking: {
          jsonRpcUrl: chain.url,
          blockNumber,
        },
      },
    ],
  });
  return chain;
};
