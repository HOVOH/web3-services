import { Network, providers } from '@hovoh/evmcontractsregistry';
import { initTraderJoeApi } from '../src';

describe('contract factory', () => {
  const api = initTraderJoeApi(providers);

  it('should return the a pair contract for Arbitrum', function () {
    const router = api
      .forNetwork(Network.AVALANCHE_MAINNET)
      .getContractInstance('JoeRouter');
    expect(router.address).toEqual(
      '0x60aE616a2155Ee3d9A68541Ba4544862310933d4'
    );
  });
});
