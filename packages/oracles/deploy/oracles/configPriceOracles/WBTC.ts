import { configChainlinkOracle } from './configOracles';

import { ChainlinkFeed, Tokens } from '~common/config';

export const CONFIG_WBTC_ORACLE = 'pp_config_wbtc';

const configWBTCPP = configChainlinkOracle(Tokens.WBTC, ChainlinkFeed.BTC);

export default configWBTCPP;
configWBTCPP.id = CONFIG_WBTC_ORACLE;
configWBTCPP.tags = ['oracle', CONFIG_WBTC_ORACLE];
