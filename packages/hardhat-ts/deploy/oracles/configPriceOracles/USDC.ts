import { configChainlinkOracle } from './configOracles';

import { ChainlinkFeed, Tokens } from '~common/config';

export const CONFIG_USDC_ORACLE = 'pp_config_usdc';

const configUSDCPP = configChainlinkOracle(Tokens.USDC, ChainlinkFeed.USDC);

export default configUSDCPP;
configUSDCPP.id = CONFIG_USDC_ORACLE;
configUSDCPP.tags = ['oracle', CONFIG_USDC_ORACLE];
