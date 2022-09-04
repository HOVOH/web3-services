import { Network, providers } from '../src';

describe('Providers Registry', () => {
  it('Should return http provider', async () => {
    const provider = providers.forNetwork(Network.OPERA_MAINNET);
  });

  it('Should return ws provider', async () => {
    const provider = providers.wsForNetwork(Network.OPERA_MAINNET);
    await provider.destroy();
  });

  it('Should return Multicall provider', async () => {
    const provider = providers.multicallForNetwork(Network.OPERA_MAINNET);
  });
});
