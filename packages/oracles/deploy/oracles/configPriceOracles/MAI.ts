import { configChainlinkOracle } from './configOracles';

import { ChainlinkFeed, Tokens } from '~common/config';

export const CONFIG_MAI_ORACLE = 'pp_config_mai';

const configUSDCPP = configChainlinkOracle(Tokens.MAI, ChainlinkFeed.MAI);

export default configUSDCPP;
configUSDCPP.id = CONFIG_MAI_ORACLE;
configUSDCPP.tags = ['oracle', CONFIG_MAI_ORACLE];
