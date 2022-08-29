/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  Fragment,
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { Call } from "@hovoh/ethcall";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface IOutboxInterface extends utils.Interface {
  functions: {
    "l2ToL1BatchNum()": FunctionFragment;
    "l2ToL1Block()": FunctionFragment;
    "l2ToL1EthBlock()": FunctionFragment;
    "l2ToL1OutputId()": FunctionFragment;
    "l2ToL1Sender()": FunctionFragment;
    "l2ToL1Timestamp()": FunctionFragment;
    "outboxEntryExists(uint256)": FunctionFragment;
    "processOutgoingMessages(bytes,uint256[])": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "l2ToL1BatchNum"
      | "l2ToL1Block"
      | "l2ToL1EthBlock"
      | "l2ToL1OutputId"
      | "l2ToL1Sender"
      | "l2ToL1Timestamp"
      | "outboxEntryExists"
      | "processOutgoingMessages"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "l2ToL1BatchNum",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "l2ToL1Block",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "l2ToL1EthBlock",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "l2ToL1OutputId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "l2ToL1Sender",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "l2ToL1Timestamp",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "outboxEntryExists",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "processOutgoingMessages",
    values: [BytesLike, BigNumberish[]]
  ): string;

  decodeFunctionResult(
    functionFragment: "l2ToL1BatchNum",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "l2ToL1Block",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "l2ToL1EthBlock",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "l2ToL1OutputId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "l2ToL1Sender",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "l2ToL1Timestamp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "outboxEntryExists",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "processOutgoingMessages",
    data: BytesLike
  ): Result;

  events: {
    "OutBoxTransactionExecuted(address,address,uint256,uint256)": EventFragment;
    "OutboxEntryCreated(uint256,uint256,bytes32,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OutBoxTransactionExecuted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OutboxEntryCreated"): EventFragment;
}

export interface OutBoxTransactionExecutedEventObject {
  destAddr: string;
  l2Sender: string;
  outboxEntryIndex: BigNumber;
  transactionIndex: BigNumber;
}
export type OutBoxTransactionExecutedEvent = TypedEvent<
  [string, string, BigNumber, BigNumber],
  OutBoxTransactionExecutedEventObject
>;

export type OutBoxTransactionExecutedEventFilter =
  TypedEventFilter<OutBoxTransactionExecutedEvent>;

export interface OutboxEntryCreatedEventObject {
  batchNum: BigNumber;
  outboxEntryIndex: BigNumber;
  outputRoot: string;
  numInBatch: BigNumber;
}
export type OutboxEntryCreatedEvent = TypedEvent<
  [BigNumber, BigNumber, string, BigNumber],
  OutboxEntryCreatedEventObject
>;

export type OutboxEntryCreatedEventFilter =
  TypedEventFilter<OutboxEntryCreatedEvent>;

export interface IOutbox extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IOutboxInterface;

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
    l2ToL1BatchNum(overrides?: CallOverrides): Promise<[BigNumber]>;

    l2ToL1Block(overrides?: CallOverrides): Promise<[BigNumber]>;

    l2ToL1EthBlock(overrides?: CallOverrides): Promise<[BigNumber]>;

    l2ToL1OutputId(overrides?: CallOverrides): Promise<[string]>;

    l2ToL1Sender(overrides?: CallOverrides): Promise<[string]>;

    l2ToL1Timestamp(overrides?: CallOverrides): Promise<[BigNumber]>;

    outboxEntryExists(
      batchNum: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    processOutgoingMessages(
      sendsData: BytesLike,
      sendLengths: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  l2ToL1BatchNum(overrides?: CallOverrides): Promise<BigNumber>;

  l2ToL1Block(overrides?: CallOverrides): Promise<BigNumber>;

  l2ToL1EthBlock(overrides?: CallOverrides): Promise<BigNumber>;

  l2ToL1OutputId(overrides?: CallOverrides): Promise<string>;

  l2ToL1Sender(overrides?: CallOverrides): Promise<string>;

  l2ToL1Timestamp(overrides?: CallOverrides): Promise<BigNumber>;

  outboxEntryExists(
    batchNum: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  processOutgoingMessages(
    sendsData: BytesLike,
    sendLengths: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    l2ToL1BatchNum(overrides?: CallOverrides): Promise<BigNumber>;

    l2ToL1Block(overrides?: CallOverrides): Promise<BigNumber>;

    l2ToL1EthBlock(overrides?: CallOverrides): Promise<BigNumber>;

    l2ToL1OutputId(overrides?: CallOverrides): Promise<string>;

    l2ToL1Sender(overrides?: CallOverrides): Promise<string>;

    l2ToL1Timestamp(overrides?: CallOverrides): Promise<BigNumber>;

    outboxEntryExists(
      batchNum: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    processOutgoingMessages(
      sendsData: BytesLike,
      sendLengths: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OutBoxTransactionExecuted(address,address,uint256,uint256)"(
      destAddr?: string | null,
      l2Sender?: string | null,
      outboxEntryIndex?: BigNumberish | null,
      transactionIndex?: null
    ): OutBoxTransactionExecutedEventFilter;
    OutBoxTransactionExecuted(
      destAddr?: string | null,
      l2Sender?: string | null,
      outboxEntryIndex?: BigNumberish | null,
      transactionIndex?: null
    ): OutBoxTransactionExecutedEventFilter;

    "OutboxEntryCreated(uint256,uint256,bytes32,uint256)"(
      batchNum?: BigNumberish | null,
      outboxEntryIndex?: null,
      outputRoot?: null,
      numInBatch?: null
    ): OutboxEntryCreatedEventFilter;
    OutboxEntryCreated(
      batchNum?: BigNumberish | null,
      outboxEntryIndex?: null,
      outputRoot?: null,
      numInBatch?: null
    ): OutboxEntryCreatedEventFilter;
  };

  estimateGas: {
    l2ToL1BatchNum(overrides?: CallOverrides): Promise<BigNumber>;

    l2ToL1Block(overrides?: CallOverrides): Promise<BigNumber>;

    l2ToL1EthBlock(overrides?: CallOverrides): Promise<BigNumber>;

    l2ToL1OutputId(overrides?: CallOverrides): Promise<BigNumber>;

    l2ToL1Sender(overrides?: CallOverrides): Promise<BigNumber>;

    l2ToL1Timestamp(overrides?: CallOverrides): Promise<BigNumber>;

    outboxEntryExists(
      batchNum: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    processOutgoingMessages(
      sendsData: BytesLike,
      sendLengths: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    l2ToL1BatchNum(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    l2ToL1Block(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    l2ToL1EthBlock(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    l2ToL1OutputId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    l2ToL1Sender(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    l2ToL1Timestamp(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    outboxEntryExists(
      batchNum: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    processOutgoingMessages(
      sendsData: BytesLike,
      sendLengths: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}

export interface IOutboxMulticall {
  address: string;
  abi: Fragment[];
  functions: FunctionFragment[];

  l2ToL1BatchNum(overrides?: CallOverrides): Call<BigNumber>;

  l2ToL1Block(overrides?: CallOverrides): Call<BigNumber>;

  l2ToL1EthBlock(overrides?: CallOverrides): Call<BigNumber>;

  l2ToL1OutputId(overrides?: CallOverrides): Call<string>;

  l2ToL1Sender(overrides?: CallOverrides): Call<string>;

  l2ToL1Timestamp(overrides?: CallOverrides): Call<BigNumber>;

  outboxEntryExists(
    batchNum: BigNumberish,
    overrides?: CallOverrides
  ): Call<boolean>;
}
