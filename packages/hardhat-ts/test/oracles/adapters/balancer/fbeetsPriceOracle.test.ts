export {};
/*
import { expect } from 'chai';
import { FBEETSPriceOracle } from 'generated/contract-types';
import hre from 'hardhat';
import { connect } from 'helpers/bindings';

import { FBEETS_ORACLE_DID } from '../../../../deploy/oracles/204_deployFBEETSOracle';

const { deployments, getNamedAccounts } = hre;

describe('fBEETSPriceOracle', function () {
  let oracle: FBEETSPriceOracle;
  let deployer: string;
  beforeEach(async function () {
    const namedAccounts = await getNamedAccounts();
    deployer = namedAccounts.deployer;
    await deployments.fixture([FBEETS_ORACLE_DID]);
    oracle = await connect(FBEETS_ORACLE_DID, hre);
  });

  it('Should return fBEETS price', async function () {
    const { FIDELIO_DUETTO, FBEETS_BAR } = externalAddressRegistry.forNetwork(await getNetwork());
    const fBeetsFtm = await oracle.getSafePrice(FBEETS_BAR);
    const signer = await xhre.ethers.getSigner(deployer);
    const balOracle = IBalV2PriceOracle__factory.connect(FIDELIO_DUETTO, signer);
    const balOracleAnswer = await balOracle.getTimeWeightedAverage([{ variable: 1, secs: 120, ago: 10 }]);
    const bptFtm = balOracleAnswer[0];
    const fBeetsSupply = await IERC20__factory.connect(FBEETS_BAR, signer).totalSupply();
    const lockedBpt = await IERC20__factory.connect(FIDELIO_DUETTO, signer).balanceOf(FBEETS_BAR);
    const expectedFBeetsFtm = bptFtm.mul(lockedBpt).div(fBeetsSupply);
    expect(fBeetsFtm).to.be.gt(bptFtm);
    expect(fBeetsFtm).to.closeTo(expectedFBeetsFtm, 1e3);
  });
});
*/
