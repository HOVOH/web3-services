import { ORACLE_TAG } from '../100_deployPriceProvider';

import { configBeethovenOracle } from './configOracles';

import { BeethovenX, Tokens } from '~common/config';

export const CONFIG_BEETS_ORACLE = 'config_beets_oracle';

const configBeetsOracle = configBeethovenOracle(Tokens.BEETS, BeethovenX.FIDELIO_DUETTO);
configBeetsOracle.id = CONFIG_BEETS_ORACLE;
configBeetsOracle.tags = [ORACLE_TAG, CONFIG_BEETS_ORACLE];
export default configBeetsOracle;
