/* Permission error */

export const ROLES_NOT_ROOT = 'RL: caller is not root';
export const RBAC_CALLER_NOT_ADMIN = 'RBAC: caller is not an admin';

/* Oracles' error */
export const PP_NO_ORACLE = 'NoOracle';
export const CL_NO_FEED = 'CLPO: no price feed';
export const BPO_UNKOWN_TOKEN = 'BPO: unkown token';

export const buildErrorMessage = (errorName: string, args: any[]): string => {
  return `${errorName}("${args.join('","')}")`;
};
