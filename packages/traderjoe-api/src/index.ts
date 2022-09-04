import {
  bindings,
  contract,
  ContractFactory,
  NetworksContractsRegistry,
  ProvidersRegistry,
} from '@hovoh/evmcontractsregistry';

import {
  BoostedMasterChefJoe__factory,
  JoeBar__factory,
  JoeFactory__factory,
  JoeHatToken__factory,
  JoePair__factory,
  JoeRouter02__factory,
  JoeToken__factory,
  MasterChefJoeV2__factory,
  MasterChefJoeV3__factory,
  StableJoeStaking__factory,
  VeJoeStaking__factory,
  VeJoeToken__factory,
} from '../generated';

const avalancheMainnetContracts = {
  JoeRouter: contract(
    '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
    JoeRouter02__factory.connect,
    JoeRouter02__factory.multicall
  ),
  JoeFactory: contract(
    '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10',
    JoeFactory__factory.connect,
    JoeFactory__factory.multicall
  ),
  JoeToken: contract(
    '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd',
    JoeToken__factory.connect,
    JoeToken__factory.multicall
  ),
  JoeBar: contract(
    '0x57319d41F71E81F3c65F2a47CA4e001EbAFd4F33',
    JoeBar__factory.connect,
    JoeBar__factory.multicall
  ),
  sJoeStaking: contract(
    '0x1a731B2299E22FbAC282E7094EdA41046343Cb51',
    StableJoeStaking__factory.connect,
    StableJoeStaking__factory.multicall
  ),
  veJoeToken: contract(
    '0x3cabf341943Bc8466245e4d6F1ae0f8D071a1456',
    VeJoeToken__factory.connect,
    VeJoeToken__factory.multicall
  ),
  veJoeStaking: contract(
    '0x25D85E17dD9e544F6E9F8D44F99602dbF5a97341',
    VeJoeStaking__factory.connect,
    VeJoeStaking__factory.multicall
  ),
  MasterChefJoeV2: contract(
    '0xd6a4F121CA35509aF06A0Be99093d08462f53052',
    MasterChefJoeV2__factory.connect,
    MasterChefJoeV2__factory.multicall
  ),
  MasterChefJoeV3: contract(
    '0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00',
    MasterChefJoeV3__factory.connect,
    MasterChefJoeV3__factory.multicall
  ),
  BoostedMasterChefJoe: contract(
    '0x4483f0b6e2F5486D06958C20f8C39A7aBe87bf8F',
    BoostedMasterChefJoe__factory.connect,
    BoostedMasterChefJoe__factory.multicall
  ),
  JoeHatToken: contract(
    '0x82FE038Ea4b50f9C957da326C412ebd73462077C',
    JoeHatToken__factory.connect,
    JoeHatToken__factory.multicall
  ),
};

const namedFactories = {
  JoePair: bindings(JoePair__factory.connect, JoePair__factory.multicall),
};

export { JoePair__factory, JoePair, IJoePair } from '../generated';

interface TraderJoeAPI {
  [42161]: typeof avalancheMainnetContracts;
}

const traderJoeApi = new NetworksContractsRegistry<
  TraderJoeAPI,
  typeof namedFactories
>();
traderJoeApi.addNetwork(42161, avalancheMainnetContracts);
traderJoeApi.setNamedFactories(namedFactories);

export const initTraderJoeApi = (
  provider: ProvidersRegistry
): ContractFactory<TraderJoeAPI, typeof namedFactories> => {
  return new ContractFactory(provider, traderJoeApi);
};
