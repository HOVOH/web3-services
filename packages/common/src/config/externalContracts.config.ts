import { NetworkID } from '@dethcrypto/eth-sdk/dist/abi-management/networks';
import { TExternalContractsAddressMap } from 'eth-hooks/models';

/**
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * #### Instructions
 * - Add your contracts to the list here
 * - The format is described by {@link TExternalContractsAddressMap}
 *
 * ### Summary
 * The list of external contracts use by the app.
 * it is used to generate the type definitions for the external contracts by `yarn contracts:build`
 * provide the name and address of the external contract and the definition will be generated
 */

export enum Tokens {
  BEETS = 'BEETS',
  COMB = 'COMB',
  DAI = 'DAI',
  GOHM = 'GOHM',
  MAI = 'MAI',
  USDC = 'USDC',
  WFTM = 'WFTM',
  WETH = 'WETH',
  WBTC = 'WBTC',
  OATH = 'OATH',
  IQ = 'IQ',
}

export enum ChainlinkFeed {
  DAI = 'cl_DAI_feed',
  ETH = 'cl_eth_feed',
  FTM = 'cl_FTM_feed',
  MAI = 'cl_mai_feed',
  OHM = 'cl_OHM_feed',
  OHM_INDEX = 'cl_ohm_index',
  BTC = 'cl_btc_feed',
  USDC = 'cl_USDC_feed',
}

export enum BeethovenX {
  VAULT = 'beethoven_x_vault',
  BEETS_MASTERCHEF = 'beethoven_x_masterchef',
  FBEETS_BAR = 'beethoven_x_fbeets_bar',
  FIDELIO_DUETTO = 'beethoven_x_fidelio_duetto',
}
const HARDHAT_NETWORK = 31337;
export const externalContractsAddressMap: TExternalContractsAddressMap = {
  [HARDHAT_NETWORK]: {},
  [NetworkID.MAINNET]: {
    [Tokens.DAI]: '0x6b175474e89094c44da98b954eedeac495271d0f',
  },
  [NetworkID.OPERA]: {
    [Tokens.BEETS]: '0xf24bcf4d1e507740041c9cfd2dddb29585adce1e',
    [Tokens.COMB]: '0xaE45a827625116d6C0C40B5D7359EcF68F8e9AFD',
    [Tokens.DAI]: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
    [Tokens.GOHM]: '0x91fa20244Fb509e8289CA630E5db3E9166233FDc',
    [Tokens.MAI]: '0xfb98b335551a418cd0737375a2ea0ded62ea213b',
    [Tokens.OATH]: '0x21Ada0D2aC28C3A5Fa3cD2eE30882dA8812279B6',
    [Tokens.WFTM]: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    [Tokens.WETH]: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
    [Tokens.WBTC]: '0x321162Cd933E2Be498Cd2267a90534A804051b11',
    [Tokens.USDC]: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
    [ChainlinkFeed.DAI]: '0x91d5DEFAFfE2854C7D02F50c80FA1fdc8A721e52',
    [ChainlinkFeed.ETH]: '0x11DdD3d147E5b83D01cee7070027092397d63658',
    [ChainlinkFeed.FTM]: '0xf4766552D15AE4d256Ad41B6cf2933482B0680dc',
    [ChainlinkFeed.MAI]: '0x827863222c9C603960dE6FF2c0dD58D457Dcc363',
    [ChainlinkFeed.OHM]: '0xb26867105D25bD127862bEA9B952Fa2E89942837',
    [ChainlinkFeed.OHM_INDEX]: '0xCeC98f20cCb5c19BB42553D70eBC2515E3B33947',
    [ChainlinkFeed.USDC]: '0x2553f4eeb82d5A26427b8d1106C51499CBa5D99c',
    [ChainlinkFeed.BTC]: '0x8e94C22142F4A64b99022ccDd994f4e9EC86E4B4',
    SPIRIT_FTM_GOHM: '0xae9BBa22E87866e48ccAcFf0689AFaa41eB94995',
    SPOOKY_MAI_USDC: '0x4de9f0ed95de2461b6db1660f908348c42893b1a',
    SPOOKY_ROUTER: '0xF491e7B69E4244ad4002BC14e878a34207E38c29',
    [BeethovenX.FIDELIO_DUETTO]: '0xcdE5a11a4ACB4eE4c805352Cec57E236bdBC3837',
    YEARN_DAI_VAULT: '0x637ec617c86d24e421328e6caea1d92114892439',
    DEMETER_DEGREE: '0xf7bf0f161d3240488807ffa23894452246049916',
    [BeethovenX.VAULT]: '0x20dd72Ed959b6147912C2e529F0a0C651c33c9ce',
    [BeethovenX.BEETS_MASTERCHEF]: '0x8166994d9ebBe5829EC86Bd81258149B87faCfd3',
    [BeethovenX.FBEETS_BAR]: '0xfcef8a994209d6916EB2C86cDD2AFD60Aa6F54b1',
  },
  [NetworkID.ARBITRUM_ONE]: {
    [Tokens.WETH]: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  },
  [NetworkID.MAINNET]: {
    [Tokens.WETH]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    [Tokens.IQ]: '0x579cea1889991f68acc35ff5c3dd0621ff29b0c9',
  },
  // [NetworkID.POLYGON]: {
  //   DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  // },
};

export interface NamedContractsMap {
  [k: string]: string;
}

export type ExternalContractsMap = typeof externalContractsAddressMap[number];
export type ExternalContractsName = keyof ExternalContractsMap;

export const getNetworkContractMap = (networkId?: number): ExternalContractsMap => {
  if (!networkId) {
    throw new Error('Network is null/undefined');
  }
  if (!externalContractsAddressMap[networkId]) {
    throw new Error(`No contracts for network ${networkId}`);
  }
  return externalContractsAddressMap[networkId];
};

export const getContractAddress = (name: ExternalContractsName, networkId?: number): string => {
  const contracts = getNetworkContractMap(networkId);
  if (!contracts[name]) {
    throw new Error(`${name} is unavailable on network ${networkId}`);
  }
  return contracts[name];
};

export const addHardhatContract = (name: ExternalContractsName, address: string): void => {
  externalContractsAddressMap[HARDHAT_NETWORK][name] = address;
};
