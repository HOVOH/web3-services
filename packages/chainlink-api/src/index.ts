import {
  bindings,
  contract,
  ContractFactory,
  Network,
  NetworksContractsRegistry,
  ProvidersRegistry,
} from '@hovoh/evmcontractsregistry';
import {
  AggregatorV3Interface__factory,
  EACAggregatorProxy__factory,
} from '../generated';

const proxy = (address: string) => {
  return contract(
    address,
    EACAggregatorProxy__factory.connect,
    EACAggregatorProxy__factory.multicall
  );
};

const avalancheMainnetContracts = {
  AAVE: proxy('0x3CA13391E9fb38a75330fb28f8cc2eB3D9ceceED'),
  AVAX: proxy('0x0A77230d17318075983913bC2145DB16C7366156'),
  BTC: proxy('0x2779D32d5166BAaa2B2b658333bA7e6Ec0C65743'),
  ETH: proxy('0x976B3D034E162d8bD72D6b9C989d545b839003b0'),
};

const arbitrumMainnetContracts = {
  AAVE: proxy('0x221912ce795669f628c51c69b7d0873eDA9C03bB'),
  BNB: proxy('0x6970460aabF80C5BE983C6b74e5D06dEDCA95D4A'),
  ETH: proxy('0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612'),
  BTC: proxy('0x6ce185860a4963106506C203335A2910413708e9'),
  FRAX: proxy('0x0809E3d38d1B4214958faf06D8b1B1a2b73f2ab8'),
};

const fantomMainnetContracts = {
  AAVE: proxy('0xE6ecF7d2361B6459cBb3b4fb065E0eF4B175Fe74'),
  BNB: proxy('0x6dE70f4791C4151E00aD02e969bD900DC961f92a'),
  BTC: proxy('0x8e94C22142F4A64b99022ccDd994f4e9EC86E4B4'),
  BOO: proxy('0xc8C80c17f05930876Ba7c1DD50D9186213496376'),
  BUSD: proxy('0xf8f57321c2e3E202394b0c0401FD6392C3e7f465'),
  CHF: proxy('0x4be9c8fb4105380116c03fC2Eeb9eA1e1a109D95'),
  CREAM: proxy('0xD2fFcCfA0934caFdA647c5Ff8e7918A10103c01c'),
  CRV: proxy('0xa141D7E3B44594cc65142AE5F2C7844Abea66D2B'),
  CVX: proxy('0x1A8d750240Cdf7b671805Eec761e622F13781cEb'),
  sFTMx: proxy('0xb94533460Db5A1d8baf56240896eBB3491E608f7'),
  DAI: proxy('0x91d5DEFAFfE2854C7D02F50c80FA1fdc8A721e52'),
  ETH: proxy('0x11DdD3d147E5b83D01cee7070027092397d63658'),
  EUR: proxy('0x3E68e68ea2c3698400465e3104843597690ae0f7'),
  FRAX: proxy('0xBaC409D670d996Ef852056f6d45eCA41A8D57FbD'),
  FTM: proxy('0xf4766552D15AE4d256Ad41B6cf2933482B0680dc'),
  LINK: proxy('0x221C773d8647BC3034e91a0c47062e26D20d97B4'),
  MIM: proxy('0x28de48D3291F31F839274B8d82691c77DF1c5ceD'),
  OHM_INDEX: proxy('0xCeC98f20cCb5c19BB42553D70eBC2515E3B33947'),
  OHM: proxy('0xb26867105D25bD127862bEA9B952Fa2E89942837'),
  SNX: proxy('0x2Eb00cC9dB7A7E0a013A49b3F6Ac66008d1456F7'),
  SPELL: proxy('0x02E48946849e0BFDD7bEa5daa80AF77195C7E24c'),
  SUSHI: proxy('0xCcc059a1a17577676c8673952Dc02070D29e5a66'),
  USDC: proxy('0x2553f4eeb82d5A26427b8d1106C51499CBa5D99c'),
  USDT: proxy('0xF64b636c5dFe1d3555A847341cDC449f612307d0'),
  YFI: proxy('0x9B25eC3d6acfF665DfbbFD68B3C1D896E067F0ae'),
};

const namedFactories = {
  AggregatorProxy: bindings(
    EACAggregatorProxy__factory.connect,
    EACAggregatorProxy__factory.multicall
  ),
  AggregatorV3: bindings(
    AggregatorV3Interface__factory.connect,
    AggregatorV3Interface__factory.multicall
  ),
};

export interface ChainlinkNetworksContractMap {
  [Network.AVALANCHE_MAINNET]: typeof avalancheMainnetContracts;
  [Network.ARBITRUM]: typeof arbitrumMainnetContracts;
  [Network.OPERA_MAINNET]: typeof fantomMainnetContracts;
}

const chainlinkApi = new NetworksContractsRegistry<
  ChainlinkNetworksContractMap,
  typeof namedFactories
>();
chainlinkApi.addNetwork(Network.AVALANCHE_MAINNET, avalancheMainnetContracts);
chainlinkApi.addNetwork(Network.ARBITRUM, arbitrumMainnetContracts);
chainlinkApi.addNetwork(Network.OPERA_MAINNET, fantomMainnetContracts);
chainlinkApi.setNamedFactories(namedFactories);

export type ChainlinkApi = ContractFactory<
  ChainlinkNetworksContractMap,
  typeof namedFactories
>;
export type ChainlinkNetworks = keyof ChainlinkNetworksContractMap;

export const initChainlinkApi = (
  providers: ProvidersRegistry
): ChainlinkApi => {
  return new ContractFactory(providers, chainlinkApi);
};

export * from '../generated';
