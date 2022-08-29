import {
  ContractFactory,
  ContractVersions,
  Network,
  NetworksContractsRegistry,
  providers,
} from '../src';
import { ERC20__factory } from '../bindings';
import { ERC20 } from '../bindings';
import { ERC20Multicall } from '../bindings/ERC20';

interface ITestRegistry {
  WFTM: ContractVersions<ERC20, ERC20Multicall>;
  BOO: ContractVersions<ERC20, ERC20Multicall>;
}

interface ITestRegistry2 {
  WFTM: ContractVersions<ERC20, ERC20Multicall>;
}

interface INetworkTestRegistries {
  [Network.OPERA_MAIN_NET]: ITestRegistry;
  [Network.OPERA_TEST_NET]: ITestRegistry2;
}

const WFTM_ADDRESS = '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83';
const BOO_ADDRESS = '0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE';

const mainnetContracts: ITestRegistry = {
  WFTM: new ContractVersions(
    [{ address: WFTM_ADDRESS, deployedAt: 1 }],
    ERC20__factory.connect,
    ERC20__factory.multicall
  ),
  BOO: new ContractVersions(
    [{ address: BOO_ADDRESS, deployedAt: 0 }],
    ERC20__factory.connect,
    ERC20__factory.multicall
  ),
};
const testnetContracts: ITestRegistry2 = {
  WFTM: new ContractVersions(
    [{ address: '0x84c5D4A62cc00FEB0214fA1AdE22a2f860D34217', deployedAt: 1 }],
    ERC20__factory.connect,
    ERC20__factory.multicall
  ),
};

const namedFactories = {
  ERC20: new ContractVersions(
    [{ address: '0x0', deployedAt: 1 }],
    ERC20__factory.connect,
    ERC20__factory.multicall
  ),
};

const contracts = new NetworksContractsRegistry<
  INetworkTestRegistries,
  typeof namedFactories
>();
contracts.addNetwork(Network.OPERA_TEST_NET, testnetContracts);
contracts.addNetwork(Network.OPERA_MAIN_NET, mainnetContracts);
contracts.setNamedFactories(namedFactories);

describe('ContractFactory', () => {
  let contractFactory: ContractFactory<
    INetworkTestRegistries,
    typeof namedFactories
  >;

  beforeEach(function () {
    contractFactory = new ContractFactory(providers, contracts);
  });

  it('Should return the network contract factory', () => {
    const networkContractFactory = contractFactory.forNetwork(
      Network.OPERA_MAIN_NET
    );
    expect(networkContractFactory.networkProvider).not.toBeNull();
  });

  it('Should return the contracts properly typed and initialised', async () => {
    const boo = contractFactory
      .forNetwork(Network.OPERA_MAIN_NET)
      .getContractInstance('BOO');
    expect(await boo.symbol()).toEqual('BOO');
    const token = contractFactory
      .forNetwork(Network.OPERA_MAIN_NET)
      .getContractInstance('WFTM');
    expect(await token.symbol()).toEqual('WFTM');
    const wftmTestnet = contractFactory
      .forNetwork(Network.OPERA_TEST_NET)
      .getContractInstance('WFTM');
    expect(await wftmTestnet.symbol()).toEqual('WFTM');
  });

  it('Should return the SimpleContract instance', () => {
    const contract = contractFactory
      .forNetwork(Network.OPERA_MAIN_NET)
      .getContract('WFTM');
    expect(contract.address).toEqual(mainnetContracts.WFTM.latest().address);
  });

  it('Should do a multicall from initialised contracts', async () => {
    const boo = contractFactory
      .forNetwork(Network.OPERA_MAIN_NET)
      .getContractInstance('BOO');
    const wftm = contractFactory
      .forNetwork(Network.OPERA_MAIN_NET)
      .getContractInstance('WFTM');
    const [wftmSymbol, booSymbol, balance] = await providers
      .multicallForNetwork(Network.OPERA_MAIN_NET)
      .all([
        wftm.multiCall.symbol(),
        boo.multiCall.symbol(),
        boo.multiCall.balanceOf('0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE'),
      ]);
    expect(wftmSymbol).toEqual('WFTM');
    expect(booSymbol).toEqual('BOO');
    expect(balance._isBigNumber).toEqual(true);
  });

  it('Should do a multicall from contract name', async () => {
    const [wftmSymbol, booSymbol, balance, erc20symbol] = await contractFactory
      .forNetwork(Network.OPERA_MAIN_NET)
      .multiCall((getContract) => [
        getContract('WFTM').symbol(),
        getContract('BOO').symbol(),
        getContract('BOO').balanceOf(
          '0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE'
        ),
        getContract('ERC20', WFTM_ADDRESS).symbol(),
      ]);
    expect(wftmSymbol).toEqual('WFTM');
    expect(booSymbol).toEqual('BOO');
    expect(balance._isBigNumber).toEqual(true);
    expect(erc20symbol).toEqual('WFTM');
    ERC20__factory.createInterface();
  });

  it('Should let override address', async () => {
    const wftm = contractFactory
      .forNetwork(Network.OPERA_MAIN_NET)
      .getContractInstance('BOO', WFTM_ADDRESS);
    return expect(await wftm.symbol()).toEqual('WFTM');
  });

  it('Should let override address on multicall', async () => {
    const [wftmSymbol] = await contractFactory
      .forNetwork(Network.OPERA_MAIN_NET)
      .multiCall((getContract) => [getContract('BOO', WFTM_ADDRESS).symbol()]);
    return expect(wftmSymbol).toEqual('WFTM');
  });

  it('should make named factories available on all networks', async () => {
    const wftm = contractFactory
      .forNetwork(Network.OPERA_MAIN_NET)
      .getContractInstance('ERC20', WFTM_ADDRESS);
    const ftmSymbol = await wftm.symbol();
    expect(ftmSymbol).toEqual('WFTM');
  });

  it.skip('Test typing promise', async () => {
    const prom0 = new Promise<number>(() => 1);
    const prom1 = new Promise<string>(() => 'test');
    const [res0, res1] = await Promise.all([prom0, prom1]);
  });
});
