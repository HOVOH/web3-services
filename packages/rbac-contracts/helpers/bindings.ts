import { connectFactory } from '@hovoh/hardhat-helpers';

import { RBAC__factory, RolesLedger__factory } from '../generated/contract-types';

import { ROLES_LEDGER_DID } from './deployments-ids';

export const connectMap = {
  [ROLES_LEDGER_DID]: RolesLedger__factory.connect,
  RBAC: RBAC__factory.connect,
};

export const connect = connectFactory(connectMap);
