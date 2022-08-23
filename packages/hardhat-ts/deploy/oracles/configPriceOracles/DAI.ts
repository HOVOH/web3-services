import { configChainlinkOracle } from './configOracles';

import { ChainlinkFeed, Tokens } from '~common/config';

export const CONFIG_DAI_ORACLE = 'pp_config_dai';

const configUSDCPP = configChainlinkOracle(Tokens.DAI, ChainlinkFeed.DAI);

export default configUSDCPP;
configUSDCPP.id = CONFIG_DAI_ORACLE;
configUSDCPP.tags = ['oracle', CONFIG_DAI_ORACLE];
