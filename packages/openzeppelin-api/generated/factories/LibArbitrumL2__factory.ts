/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  LibArbitrumL2,
  LibArbitrumL2Interface,
  LibArbitrumL2Multicall,
} from "../LibArbitrumL2";
import { Contract as MulticallContract } from "@hovoh/ethcall";
const _abi = [
  {
    inputs: [],
    name: "ARBSYS",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x6091610038600b82828239805160001a607314602b57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c8063bf0a12cf146038575b600080fd5b603f606481565b6040516001600160a01b03909116815260200160405180910390f3fea2646970667358221220ab77562c84149237fab25891fe1774b814b98c91e76d3514eed6eca6c576ce6864736f6c63430008090033";

type LibArbitrumL2ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: LibArbitrumL2ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class LibArbitrumL2__factory extends ContractFactory {
  constructor(...args: LibArbitrumL2ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<LibArbitrumL2> {
    return super.deploy(overrides || {}) as Promise<LibArbitrumL2>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): LibArbitrumL2 {
    return super.attach(address) as LibArbitrumL2;
  }
  override connect(signer: Signer): LibArbitrumL2__factory {
    return super.connect(signer) as LibArbitrumL2__factory;
  }

  static readonly bytecode = _bytecode;
  // common body

  static readonly abi = _abi;
  static createInterface(): LibArbitrumL2Interface {
    return new utils.Interface(_abi) as LibArbitrumL2Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): LibArbitrumL2 {
    return new Contract(address, _abi, signerOrProvider) as LibArbitrumL2;
  }
  static multicall(address: string): LibArbitrumL2Multicall {
    return new MulticallContract(
      address,
      _abi
    ) as unknown as LibArbitrumL2Multicall;
  }
}
