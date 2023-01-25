import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

import {
  INetworksContractMap,
  NetworksContractsRegistry,
} from './contractRegistry';
import {
  ContractVersions,
  IContractsRegistry,
  SimpleContract,
} from './Contract';
import { Call, initMulticallProvider } from '@hovoh/ethcall';
import { isAddress } from 'ethers/lib/utils';
import { IProvidersRegistry, NetworkID } from './IProvidersRegistry';

export class ContractFactory<T extends INetworksContractMap<T>, F> {
  public readonly providers: IProvidersRegistry;
  private contracts: NetworksContractsRegistry<T, F>;

  constructor(
    providersRegistry: IProvidersRegistry,
    contractsRegistry: NetworksContractsRegistry<T, F>
  ) {
    this.providers = providersRegistry;
    this.contracts = contractsRegistry;
  }

  public forNetwork<K extends keyof T>(
    network: K,
    provider?: Provider | Signer | null
  ) {
    const nid = network as NetworkID;
    if (!this.providers.networkAvailable(nid) && !provider) {
      throw Error(`Network ${String(network)} is not available`);
    }
    const networkProvider = provider || this.providers.forNetwork(nid);
    const contracts = this.contracts.forNetwork(network);
    return new NetworkContractFactory<T[K] & F, keyof T[K]>(
      networkProvider,
      nid as number,
      contracts as T[K] & F,
      this.contracts.getContractNames(network)
    ) as unknown as IContractFactory<T[K] & F, keyof T[K]>;
  }
}

export interface IContractFactory<T extends IContractsRegistry<keyof T>, L> {
  readonly networkProvider: Provider | Signer;
  readonly chainId: number;
  readonly contracts: IContractsRegistry<keyof T>;
  readonly contractNames: L[];

  multiCall<K extends keyof T, T1, T2>(
    calls: (
      get: (
        contractName: K,
        address?: string
      ) => ReturnType<T[K]['multicallFactory']>
    ) => [Call<T1>, Call<T2>]
  ): Promise<readonly [T1, T2]>;
  multiCall<K extends keyof T, T1, T2, T3>(
    calls: (
      get: (
        contractName: K,
        address?: string
      ) => ReturnType<T[K]['multicallFactory']>
    ) => [Call<T1>, Call<T2>, Call<T3>]
  ): Promise<readonly [T1, T2, T3]>;
  multiCall<K extends keyof T, T1, T2, T3, T4>(
    calls: (
      get: (
        contractName: K,
        address?: string
      ) => ReturnType<T[K]['multicallFactory']>
    ) => [Call<T1>, Call<T2>, Call<T3>, Call<T4>]
  ): Promise<readonly [T1, T2, T3, T4]>;
  multiCall<K extends keyof T, T1, T2, T3, T4, T5>(
    calls: (
      get: (
        contractName: K,
        address?: string
      ) => ReturnType<T[K]['multicallFactory']>
    ) => [Call<T1>, Call<T2>, Call<T3>, Call<T4>, Call<T5>]
  ): Promise<readonly [T1, T2, T3, T4, T5]>;
  multiCall<K extends keyof T, T1, T2, T3, T4, T5, T6>(
    calls: (
      get: (
        contractName: K,
        address?: string
      ) => ReturnType<T[K]['multicallFactory']>
    ) => [Call<T1>, Call<T2>, Call<T3>, Call<T4>, Call<T5>, Call<T6>]
  ): Promise<readonly [T1, T2, T3, T4, T5, T6]>;
  multiCall<K extends keyof T, T1, T2, T3, T4, T5, T6, T7>(
    calls: (
      get: (
        contractName: K,
        address?: string
      ) => ReturnType<T[K]['multicallFactory']>
    ) => [Call<T1>, Call<T2>, Call<T3>, Call<T4>, Call<T5>, Call<T6>, Call<T7>]
  ): Promise<readonly [T1, T2, T3, T4, T5, T6, T7]>;
  multiCall<K extends keyof T, T1, T2, T3, T4, T5, T6, T7, T8>(
    calls: (
      get: (
        contractName: K,
        address?: string
      ) => ReturnType<T[K]['multicallFactory']>
    ) => [
      Call<T1>,
      Call<T2>,
      Call<T3>,
      Call<T4>,
      Call<T5>,
      Call<T6>,
      Call<T7>,
      Call<T8>
    ]
  ): Promise<readonly [T1, T2, T3, T4, T5, T6, T7, T8]>;
  multiCall<K extends keyof T, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    calls: (
      get: (
        contractName: K,
        address?: string
      ) => ReturnType<T[K]['multicallFactory']>
    ) => [
      Call<T1>,
      Call<T2>,
      Call<T3>,
      Call<T4>,
      Call<T5>,
      Call<T6>,
      Call<T7>,
      Call<T8>,
      Call<T9>
    ]
  ): Promise<readonly [T1, T2, T3, T4, T5, T6, T7, T8, T9]>;

  multiCall<K extends keyof T, T1>(
    calls: (
      get: (
        contractName: K,
        address?: string
      ) => ReturnType<T[K]['multicallFactory']>
    ) => Call<T1>[]
  ): Promise<readonly T1[]>;

  getContractVersions<K extends keyof T>(
    contractName: K
  ): ContractVersions<
    ReturnType<T[K]['factory']>,
    ReturnType<T[K]['multicallFactory']>
  >;
  getContractAtBlock<K extends keyof T>(
    contractName: K,
    atBlock: number
  ): SimpleContract<
    ReturnType<T[K]['factory']>,
    ReturnType<T[K]['multicallFactory']>
  >;
  getContractVersion<K extends keyof T>(
    contractName: K,
    version: number
  ): SimpleContract<
    ReturnType<T[K]['factory']>,
    ReturnType<T[K]['multicallFactory']>
  >;
  getContract<K extends keyof T>(
    contractName: K
  ): SimpleContract<
    ReturnType<T[K]['factory']>,
    ReturnType<T[K]['multicallFactory']>
  >;
  getContractInstance<K extends keyof T>(
    contractName: K,
    address?: string
  ): ReturnType<T[K]['factory']> & {
    multiCall: ReturnType<T[K]['multicallFactory']>;
  };
  getContractInstanceAtBlock<K extends keyof T>(
    contractName: K,
    blockNumber: number
  ): ReturnType<T[K]['factory']> & {
    multiCall: ReturnType<T[K]['multicallFactory']>;
  };
}

// T is name => ContractVersion<FactoryType>
export class NetworkContractFactory<T extends IContractsRegistry<keyof T>, L> {
  public readonly networkProvider: Provider | Signer;
  public readonly contracts: IContractsRegistry<keyof T>;
  public readonly chainId: number;
  public readonly contractNames: L[];

  constructor(
    provider: Provider | Signer,
    chainId: number,
    contractsRegistry: T,
    contractNameList: L[]
  ) {
    this.networkProvider = provider;
    this.contracts = contractsRegistry;
    this.chainId = chainId;
    this.contractNames = contractNameList;
  }

  public getContractVersions<K extends keyof T>(contractName: K) {
    return this.contracts[contractName] as ContractVersions<
      ReturnType<T[K]['factory']>,
      ReturnType<T[K]['multicallFactory']>
    >;
  }

  public getContractAtBlock<K extends keyof T>(
    contractName: K,
    atBlock: number
  ) {
    return this.contracts[contractName].atBlock(atBlock) as SimpleContract<
      ReturnType<T[K]['factory']>,
      ReturnType<T[K]['multicallFactory']>
    >;
  }

  public getContractVersion<K extends keyof T>(
    contractName: K,
    version: number
  ) {
    return this.getContractVersions(contractName).getVersion(
      version
    ) as SimpleContract<
      ReturnType<T[K]['factory']>,
      ReturnType<T[K]['multicallFactory']>
    >;
  }

  public getContract<K extends keyof T>(contractName: K) {
    const contract = this.getContractVersions(contractName).latest();
    return contract as SimpleContract<
      ReturnType<T[K]['factory']>,
      ReturnType<T[K]['multicallFactory']>
    >;
  }

  public getContractInstance<K extends keyof T>(
    contractName: K,
    address?: string
  ) {
    const contract = this.getContract(contractName);
    if (!address && !isAddress(contract.address)) {
      throw Error(
        'Cannot instanciate contract: Invalid address. Override it with the address parameter'
      );
    }
    return this.instanciateContract(contract, address);
  }

  public getContractInstanceAtBlock<K extends keyof T>(
    contractName: K,
    blockNumber: number
  ) {
    const contract = this.getContractAtBlock(contractName, blockNumber);
    return this.instanciateContract(contract);
  }

  private instanciateContract<T, U>(
    contract: SimpleContract<T, U>,
    address?: string
  ) {
    address = address ?? contract.address;
    const instance = contract.factory(address, this.networkProvider) as {
      multiCall: U;
    } & T;
    instance.multiCall = this.multiCallInstance(contract, address);
    return instance;
  }

  public multiCallInstance<T>(
    contract: SimpleContract<any, T>,
    address?: string
  ) {
    return contract.multicallFactory(address ?? contract.address);
  }

  public multiCall<K extends keyof T>(
    calls: (
      get: (
        contractName: K,
        address?: string
      ) => ReturnType<T[K]['multicallFactory']>
    ) => Call<any>[]
  ) {
    const getMultiCall = (contractName: K, address?: string) =>
      this.multiCallInstance(this.getContract(contractName), address);
    return initMulticallProvider(
      this.networkProvider as Provider,
      this.chainId
    ).then((multicall) => multicall.all(calls(getMultiCall)));
  }
}
