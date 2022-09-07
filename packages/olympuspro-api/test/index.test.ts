import { Network, providers } from '@hovoh/evmcontractsregistry';
import { initOlympusProApi } from '../src';

describe('contract factory', () => {
  const api = initOlympusProApi(providers);

  it('should return the GMX bond contract for Arbitrum', function () {
    const bond = api
      .forNetwork(Network.ARBITRUM)
      .getContractInstance('WETHGMX');
    expect(bond.address).toEqual('0xdfb034cd2789b9f85e57d25C69E161eA0bdC8f53');
  });
});
