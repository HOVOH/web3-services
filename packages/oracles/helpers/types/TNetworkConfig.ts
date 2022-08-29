import { NETWORKS } from '~common/constants';
import { TNetworkNames } from '~common/models';

export type TNetworkConfig = typeof NETWORKS[TNetworkNames];
