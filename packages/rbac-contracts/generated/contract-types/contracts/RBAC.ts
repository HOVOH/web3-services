/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { Fragment, FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { Call } from "@hovoh/ethcall";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../common";

export interface RBACInterface extends utils.Interface {
  contractName: "RBAC";

  functions: {
    "addProcess(address)": FunctionFragment;
    "getRolesLedger()": FunctionFragment;
    "isProcess(address)": FunctionFragment;
    "removeProcess(address)": FunctionFragment;
    "roles()": FunctionFragment;
    "setRolesLedger(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addProcess"
      | "getRolesLedger"
      | "isProcess"
      | "removeProcess"
      | "roles"
      | "setRolesLedger"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "addProcess", values: [string]): string;
  encodeFunctionData(
    functionFragment: "getRolesLedger",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "isProcess", values: [string]): string;
  encodeFunctionData(
    functionFragment: "removeProcess",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "roles", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setRolesLedger",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "addProcess", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getRolesLedger",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isProcess", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeProcess",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "roles", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setRolesLedger",
    data: BytesLike
  ): Result;

  events: {};
}

export interface RBAC extends BaseContract {
  contractName: "RBAC";

  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: RBACInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    addProcess(
      _address: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getRolesLedger(overrides?: CallOverrides): Promise<[string]>;

    isProcess(_address: string, overrides?: CallOverrides): Promise<[boolean]>;

    removeProcess(
      _address: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    roles(overrides?: CallOverrides): Promise<[string]>;

    setRolesLedger(
      _roles: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  addProcess(
    _address: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getRolesLedger(overrides?: CallOverrides): Promise<string>;

  isProcess(_address: string, overrides?: CallOverrides): Promise<boolean>;

  removeProcess(
    _address: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  roles(overrides?: CallOverrides): Promise<string>;

  setRolesLedger(
    _roles: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addProcess(_address: string, overrides?: CallOverrides): Promise<void>;

    getRolesLedger(overrides?: CallOverrides): Promise<string>;

    isProcess(_address: string, overrides?: CallOverrides): Promise<boolean>;

    removeProcess(_address: string, overrides?: CallOverrides): Promise<void>;

    roles(overrides?: CallOverrides): Promise<string>;

    setRolesLedger(_roles: string, overrides?: CallOverrides): Promise<void>;
  };

  filters: {};

  estimateGas: {
    addProcess(
      _address: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getRolesLedger(overrides?: CallOverrides): Promise<BigNumber>;

    isProcess(_address: string, overrides?: CallOverrides): Promise<BigNumber>;

    removeProcess(
      _address: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    roles(overrides?: CallOverrides): Promise<BigNumber>;

    setRolesLedger(
      _roles: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addProcess(
      _address: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getRolesLedger(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isProcess(
      _address: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    removeProcess(
      _address: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    roles(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setRolesLedger(
      _roles: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}

export interface RBACMulticall {
  address: string;
  abi: Fragment[];
  functions: FunctionFragment[];

  getRolesLedger(overrides?: CallOverrides): Call<string>;

  isProcess(_address: string, overrides?: CallOverrides): Call<boolean>;

  roles(overrides?: CallOverrides): Call<string>;
}
