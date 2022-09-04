import { Network, providers } from '@hovoh/evmcontractsregistry';
import { initChainlinkApi } from '../src';

describe('contract factory', () => {
  const api = initChainlinkApi(providers);

  it('should return the btc proxy contract for Arbitrum', function () {
    const proxy = api.forNetwork(Network.ARBITRUM).getContractInstance('BTC');
    expect(proxy.address).toEqual('0x6ce185860a4963106506C203335A2910413708e9');
  });
});
