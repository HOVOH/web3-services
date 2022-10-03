import { IContractsRegistry } from './Contract';

export type INetworksContractMap<N> = {
  [network in keyof N]: IContractsRegistry<keyof N[network]>;
};

// T is registry keyed types
export class NetworksContractsRegistry<T extends INetworksContractMap<T>, F> {
  map: INetworksContractMap<T>;
  factories: F;

  constructor() {
    this.map = {} as INetworksContractMap<T>;
    this.factories = {} as F;
  }

  public forNetwork<K extends keyof T>(
    network: K
  ): INetworksContractMap<T>[K] & F {
    if (!this.factories && !this.networkAvailable(network)) {
      throw new Error(`Contracts for network ${String(network)} unavailable`);
    }
    if (!this.networkAvailable(network)) {
      return { ...this.factories } as INetworksContractMap<T>[K] & F;
    }
    return { ...this.map[network], ...this.factories };
  }

  public addNetwork<K extends keyof T>(network: K, registry: T[K]) {
    this.map[network] = registry;
  }

  public networkAvailable<K extends keyof T>(network: K): boolean {
    return Boolean(this.map[network]);
  }

  public setNamedFactories(factoriesMap: F) {
    this.factories = factoriesMap;
  }
}
