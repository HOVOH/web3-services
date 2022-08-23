import { configChainlinkOracle } from './configOracles';

import { ChainlinkFeed, Tokens } from '~common/config';

export const CONFIG_WFTM_ORACLE = 'pp_config_wftm';

const configWFTMPP = configChainlinkOracle(Tokens.WFTM, ChainlinkFeed.FTM);

export default configWFTMPP;
configWFTMPP.id = CONFIG_WFTM_ORACLE;
configWFTMPP.tags = ['oracle', CONFIG_WFTM_ORACLE];
