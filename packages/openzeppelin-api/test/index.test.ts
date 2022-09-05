import { Network, providers } from '@hovoh/evmcontractsregistry';
import { initOpenZeppelinAPI } from '../src';

describe('contract factory', () => {
  const api = initOpenZeppelinAPI(providers);

  it('should return the ERC20 contract', function () {
    const pair = api.forNetwork(Network.ARBITRUM).getContractInstance('ERC20');
    expect(pair.symbol).toBeDefined();
  });
});
