import '../../../helpers/chai-imports';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { BalV2WeightedPoolLPPriceOracle, IBalPoolV2, IBalPoolV2__factory, IBalVaultV2, IBalVaultV2__factory } from 'generated/contract-types';
import hre from 'hardhat';
import { SignerWithAddress } from 'hardhat-deploy-ethers/signers';
import { connect } from 'helpers/bindings';

import { BAL_LP_PRICE_ORACLE_DID } from '../../../../deploy/oracles/206_deployBalLPPriceOracle';
import { CONFIG_USDC_ORACLE } from '../../../../deploy/oracles/configPriceOracles/USDC';
import { CONFIG_WBTC_ORACLE } from '../../../../deploy/oracles/configPriceOracles/WBTC';
import { CONFIG_WETH_ORACLE } from '../../../../deploy/oracles/configPriceOracles/WETH';
import { ORACLE_TESTS_BLOCK_NUMBER } from '../../../helpers/constants';
import { fork, getChainId } from '../../../helpers/fork';
import { getPriceDenominatedIn } from '../../../helpers/prices';

import { BeethovenX, getContractAddress } from '~common/config';

const { deployments } = hre;

const BEETS_USDC_FTM_WBTC_WETH_ID = '0xf3a602d30dcb723a74a0198313a7551feaca7dac00010000000000000000005f';
const BPT = '0xf3A602d30dcB723A74a0198313a7551FEacA7DAc';
const BPT_DECIMALS = [6, 18, 8, 18];
describe('Balancer V2 Weighted Pool Price Oracle', function () {
  let deployer: SignerWithAddress;
  let oracle: BalV2WeightedPoolLPPriceOracle;
  let vault: IBalVaultV2;
  let bpt: IBalPoolV2;
  let BASE_TOKEN: string;

  before(async function () {
    [deployer] = await hre.ethers.getSigners();
  });

  beforeEach(async function () {
    await fork('fantom', ORACLE_TESTS_BLOCK_NUMBER, hre);
    await deployments.fixture([BAL_LP_PRICE_ORACLE_DID, CONFIG_USDC_ORACLE, CONFIG_WBTC_ORACLE, CONFIG_WETH_ORACLE]);
    oracle = await connect(BAL_LP_PRICE_ORACLE_DID, hre);
    BASE_TOKEN = await oracle.BASE_TOKEN();
    await oracle.setToleratedSpread(100);
    vault = IBalVaultV2__factory.connect(getContractAddress(BeethovenX.VAULT, getChainId()), deployer);
    bpt = IBalPoolV2__factory.connect(BPT, deployer);
  });

  it('Should be able to get current price', async function () {
    const price = await oracle.getCurrentPrice(BPT);
    const poolTokens = await vault.getPoolTokens(BEETS_USDC_FTM_WBTC_WETH_ID);
    const prices = await Promise.all(poolTokens.tokens.map(async (token) => await getPriceDenominatedIn(token, BASE_TOKEN)));
    const values = prices.map((price, i) => price.mul(poolTokens.balances[i]).div(BigNumber.from(10).pow(BPT_DECIMALS[i])));
    const tvl = values.reduce((acc, value) => acc.add(value), BigNumber.from('0'));
    const tvlFromBPT = (await bpt.totalSupply()).mul(price).div(parseUnits('1'));
    expect(tvl).to.closeTo(tvlFromBPT, tvl.div(100)); // 1% difference
  });

  it('Should be able to get safe price', async function () {
    const price = await oracle.getSafePrice(BPT);

    const poolTokens = await vault.getPoolTokens(BEETS_USDC_FTM_WBTC_WETH_ID);
    const prices = await Promise.all(poolTokens.tokens.map(async (token) => await getPriceDenominatedIn(token, BASE_TOKEN)));
    const values = prices.map((price, i) => price.mul(poolTokens.balances[i]).div(BigNumber.from(10).pow(BPT_DECIMALS[i])));
    const tvl = values.reduce((acc, value) => acc.add(value), BigNumber.from('0'));
    const tvlFromBPT = (await bpt.totalSupply()).mul(price).div(parseUnits('1'));
    expect(tvl).to.closeTo(tvlFromBPT, tvl.div(100)); // 1% difference
  });

  it('Should be able to update safe price', async function () {
    await oracle.updateSafePrice(BPT);
  });

  it('Should check ratio of the pool', async function () {
    await oracle.setToleratedSpread(1); // 0.01%

    await expect(oracle.getSafePrice(BPT)).to.revertedWith('BWPLPPO: spread threshold reached');
  });
});
