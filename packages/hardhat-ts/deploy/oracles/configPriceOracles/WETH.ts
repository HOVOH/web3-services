import { configChainlinkOracle } from './configOracles';

import { ChainlinkFeed, Tokens } from '~common/config';

export const CONFIG_WETH_ORACLE = 'pp_config_weth';

const configWETHPP = configChainlinkOracle(Tokens.WETH, ChainlinkFeed.ETH);

export default configWETHPP;
configWETHPP.id = CONFIG_WETH_ORACLE;
configWETHPP.tags = ['oracle', CONFIG_WETH_ORACLE];
