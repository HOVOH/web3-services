import { Network } from './Network';
import { ProvidersRegistry } from './ProvidersRegistry';

export const providers = new ProvidersRegistry();

// url: `https://rpcapi.fantom.network`
// url: `https://rpc.ftm.tools`
// url: `https://rpc.ankr.com/fantom`
providers.addNetwork(Network.OPERA_MAIN_NET, {
  httpRpc: ['https://rpc.ftm.tools'],
  wsRpc: ['wss://wsapi.fantom.network/'],
});

providers.addNetwork(Network.OPERA_TEST_NET, {
  httpRpc: ['https://rpc.testnet.fantom.network/'],
  wsRpc: [],
});

providers.addNetwork(Network.XDAI, {
  httpRpc: ['https://dai.poa.network'],
  wsRpc: [],
});

providers.addNetwork(Network.POLYGON, {
  httpRpc: ['https://matic-mainnet.chainstacklabs.com'],
  wsRpc: [],
});

providers.addNetwork(Network.MUMBAI, {
  httpRpc: ['https://matic-mumbai.chainstacklabs.com'],
  wsRpc: [],
});

providers.addNetwork(Network.ARBITRUM_TEST_NET, {
  httpRpc: [`https://rinkeby.arbitrum.io/rpc`],
  wsRpc: [],
});

providers.addNetwork(Network.ARBITRUM, {
  httpRpc: [`https://arb1.arbitrum.io/rpc`],
  wsRpc: [],
});

providers.addNetwork(Network.OPTIMISM, {
  httpRpc: [`https://mainnet.optimism.io`],
  wsRpc: [],
});

providers.addNetwork(Network.OPTIMISM_KOVAN, {
  httpRpc: [`https://kovan.optimism.io`],
  wsRpc: [],
});

providers.addNetwork(Network.AVALANCHE_C_CHAIN, {
  httpRpc: [`https://api.avax.network/ext/bc/C/rpc`],
  wsRpc: [],
});

providers.addNetwork(Network.AVANLANCHE_FUJI, {
  httpRpc: [`https://api.avax-test.network/ext/bc/C/rpc`],
  wsRpc: [],
});
