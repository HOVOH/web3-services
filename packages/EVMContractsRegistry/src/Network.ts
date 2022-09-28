export enum Network {
  LOCALHOST = 31337,
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  OPTIMISM = 10,
  KOVAN = 42,
  OPTIMISM_KOVAN = 69,
  XDAI = 100,
  POLYGON = 137,
  OPERA_MAINNET = 250,
  OPERA_TESTNET = 4002,
  HARDHAT = 31337,
  ARBITRUM = 42161,
  AVANLANCHE_FUJI = 43113,
  AVALANCHE_MAINNET = 43114,
  MUMBAI = 80001,
  ARBITRUM_TESTNET = 421611,
}

export type NetworkName = keyof typeof NETWORKS_INFO;

export type NetworkConfig = typeof NETWORKS_INFO[NetworkName];

export const NETWORKS_INFO = {
  localhost: {
    name: 'localhost',
    color: '#666666',
    chainId: Network.LOCALHOST,
    blockExplorer: '',
    url: 'http://localhost:8545',
  },
  mainnet: {
    name: 'mainnet',
    color: '#ff8b9e',
    chainId: Network.MAINNET,
    blockExplorer: 'https://etherscan.io/',
  },
  kovan: {
    name: 'kovan',
    color: '#7003DD',
    chainId: Network.KOVAN,
    blockExplorer: 'https://kovan.etherscan.io/',
    faucet: 'https://gitter.im/kovan-testnet/faucet', // https://faucet.kovan.network/
  },
  rinkeby: {
    name: 'rinkeby',
    color: '#e0d068',
    chainId: Network.RINKEBY,
    faucet: 'https://faucet.rinkeby.io/',
    blockExplorer: 'https://rinkeby.etherscan.io/',
  },
  ropsten: {
    name: 'ropsten',
    color: '#F60D09',
    chainId: Network.ROPSTEN,
    faucet: 'https://faucet.ropsten.be/',
    blockExplorer: 'https://ropsten.etherscan.io/',
  },
  goerli: {
    name: 'goerli',
    color: '#0975F6',
    chainId: Network.GOERLI,
    faucet: 'https://goerli-faucet.slock.it/',
    blockExplorer: 'https://goerli.etherscan.io/',
  },
  xdai: {
    name: 'xdai',
    color: '#48a9a6',
    chainId: Network.XDAI,
    price: 1,
    gasPrice: 1200000000,
    faucet: 'https://xdai-faucet.top/',
    blockExplorer: 'https://blockscout.com/poa/xdai/',
  },
  polygon: {
    name: 'polygon',
    color: '#2bbdf7',
    chainId: Network.POLYGON,
    price: 1,
    gasPrice: 3500000000,
    faucet: 'https://faucet.matic.network',
    blockExplorer: 'https://polygonscan.com',
  },
  mumbai: {
    name: 'mumbai',
    color: '#92D9FA',
    chainId: Network.MUMBAI,
    price: 1,
    gasPrice: 2000000000,
    url: 'https://matic-mumbai.chainstacklabs.com',
    faucet: 'https://faucet.matic.network',
    blockExplorer: 'https://mumbai.polygonscan.com/',
  },
  rinkebyArbitrum: {
    name: 'Arbitrum Testnet',
    color: '#50a0ea',
    chainId: Network.ARBITRUM_TESTNET,
    blockExplorer: 'https://rinkeby-explorer.arbitrum.io/#/',
    url: `https://rinkeby.arbitrum.io/rpc`,
  },
  arbitrum: {
    name: 'Arbitrum',
    color: '#50a0ea',
    chainId: Network.ARBITRUM,
    blockExplorer: 'https://explorer.arbitrum.io/#/',
    url: `https://arb1.arbitrum.io/rpc`,
    gasPrice: 0,
  },
  kovanOptimism: {
    name: 'kovanOptimism',
    color: '#f01a37',
    chainId: Network.OPTIMISM_KOVAN,
    blockExplorer: 'https://kovan-optimistic.etherscan.io/',
    url: `https://kovan.optimism.io`,
    gasPrice: 0,
  },
  optimism: {
    name: 'optimism',
    color: '#f01a37',
    chainId: Network.OPTIMISM,
    blockExplorer: 'https://optimistic.etherscan.io/',
  },
  fujiAvalanche: {
    name: 'fujiAvalanche',
    color: '#666666',
    chainId: Network.AVANLANCHE_FUJI,
    blockExplorer: 'https://cchain.explorer.avax-test.network/',
    url: `https://api.avax-test.network/ext/bc/C/rpc`,
    gasPrice: 225000000000,
  },
  avalanche: {
    name: 'avalanche',
    color: '#666666',
    chainId: Network.AVALANCHE_MAINNET,
    blockExplorer: 'https://cchain.explorer.avax.network/',
    url: `https://api.avax.network/ext/bc/C/rpc`,
    gasPrice: 225000000000,
  },
  fantom: {
    name: 'fantom',
    color: '#1969ff',
    chainId: Network.OPERA_MAINNET,
    blockExplorer: 'https://ftmscan.com/',
    // url: `https://rpcapi.fantom.network`,
    url: `https://rpc.ftm.tools`,
    // url: `https://rpc.ankr.com/fantom`,
    gasPrice: 1000000000,
  },
  testnetFantom: {
    name: 'testnetFantom',
    color: '#1969ff',
    chainId: Network.OPERA_TESTNET,
    blockExplorer: 'https://testnet.ftmscan.com/',
    url: `https://rpc.testnet.fantom.network`,
    gasPrice: 1000000000,
    faucet: 'https://faucet.fantom.network/',
  },
} as const;
