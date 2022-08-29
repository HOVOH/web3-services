import {
  ContractVersions,
  NetworksContractsRegistry,
  BindingsFactory,
} from '@hovoh/evmcontractsregistry';

import { RolesLedger__factory } from '../generated';
import { getExport } from './exports';
import { MulticallBindingsFactory } from '@hovoh/evmcontractsregistry/dist/Contract';

const contract = <T, S>(
  name: string,
  factory: BindingsFactory<T>,
  multicall: MulticallBindingsFactory<S>,
  deployedAt = 0
) => {
  const deployment = getExport(name, 250);
  return new ContractVersions(
    [{ address: deployment.address, deployedAt }],
    factory,
    multicall
  );
};

const fantomMainnetContracts = {
  RolesLedger: contract(
    'roles_ledger',
    RolesLedger__factory.connect,
    RolesLedger__factory.multicall
  ),
};

export interface OraclesApi {
  250: typeof fantomMainnetContracts;
}

export const oraclesApi = new NetworksContractsRegistry<OraclesApi>();
oraclesApi.addNetwork(250, fantomMainnetContracts);
