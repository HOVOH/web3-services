import { Network, providers } from '@hovoh/evmcontractsregistry';
import { initUniswapAPI, UniswapV2Pair } from '../src';

describe('contract factory', () => {
  const api = initUniswapAPI(providers);

  it('should return the a pair contract for Arbitrum', function () {
    const pair = api.forNetwork(Network.ARBITRUM).getContractInstance('Pair');
    expect(pair.token0).toBeDefined();
  });
});
