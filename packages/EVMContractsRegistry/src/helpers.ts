import {
  BindingsFactory,
  ContractVersions,
  MulticallBindingsFactory,
} from './Contract';

export const contract = <T, S>(
  address: string,
  factory: BindingsFactory<T>,
  multicall: MulticallBindingsFactory<S>,
  deployedAt = 0
) => {
  return new ContractVersions([{ address, deployedAt }], factory, multicall);
};

export const bindings = <T, S>(
  factory: BindingsFactory<T>,
  multicall: MulticallBindingsFactory<S>
) => {
  return contract('0x0', factory, multicall);
};
