import { Network } from '@hovoh/evmcontractsregistry';

export const addresses = {
  [Network.ARBITRUM]: {
    WETH: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    GMX: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
    WBTC: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  },
  [Network.AVALANCHE_MAINNET]: {
    WAVAX: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    WETH: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
    WBTC: '0x50b7545627a5162F82A992c33b87aDc75187B218',
  },
};
