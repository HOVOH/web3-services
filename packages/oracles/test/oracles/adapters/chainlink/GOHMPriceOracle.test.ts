import { expect } from 'chai';
import { GOHMPriceOracle } from 'generated/contract-types';
import hre from 'hardhat';
import { connect } from 'helpers/bindings';
import { TNetworkConfig } from 'helpers/types/TNetworkConfig';

import { GOHM_ORACLE_DID } from '../../../../deploy/oracles/200_deployGOHMPriceOracle';
import { ORACLE_TESTS_BLOCK_NUMBER } from '../../../helpers/constants';
import { fork } from '../../../helpers/fork';
import { getPriceDenominatedIn } from '../../../helpers/prices';

import { getContractAddress, Tokens } from '~common/config';

const { deployments } = hre;

describe('GOHMSpotPriceOracle', function () {
  let oracle: GOHMPriceOracle;
  let chain: TNetworkConfig;

  beforeEach(async function () {
    chain = await fork('fantom', ORACLE_TESTS_BLOCK_NUMBER, hre);
    await deployments.fixture([GOHM_ORACLE_DID]);
    oracle = await connect(GOHM_ORACLE_DID, hre);
  });

  it('should return gOHM priced in FTM', async function () {
    const GOHM = getContractAddress(Tokens.GOHM, chain.chainId);
    const WFTM = getContractAddress(Tokens.WFTM, chain.chainId);

    const externalGOHMFTM = await getPriceDenominatedIn(GOHM, WFTM);
    const oracleGOHMFTM = await oracle.getCurrentPrice(GOHM);
    expect(oracleGOHMFTM).to.closeTo(externalGOHMFTM, externalGOHMFTM.mul(2).div(100) as any);
  });
});
