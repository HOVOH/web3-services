import { JsonRpcProvider, WebSocketProvider } from '@ethersproject/providers';
import { Wallet } from 'ethers';
import { IMulticallProvider } from '@hovoh/ethcall';

export interface IProvider {
  httpRpc: string[];
  wsRpc: string[];
}

export type NetworkID = string | number;

export interface INetworksProviders {
  [networkID: NetworkID]: IProvider;
}

export interface IProvidersRegistry {
  setPrivateKey(pk: string): void;
  forNetwork(nid: NetworkID): JsonRpcProvider | Wallet;
  getUrl(nid: NetworkID): string;
  wsForNetwork(nid: NetworkID): WebSocketProvider;
  getWsUrl(nid: NetworkID): string;
  multicallForNetwork(nid: NetworkID): IMulticallProvider;
  addNetwork(nid: NetworkID, providers: IProvider): void;
  networkAvailable(nid: NetworkID): boolean;
}
