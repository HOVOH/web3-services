import { expect } from 'chai';
import { BalV2PriceOracle, RolesLedger } from 'generated/contract-types';
import hre from 'hardhat';
import { SignerWithAddress } from 'hardhat-deploy-ethers/signers';
import { connect } from 'helpers/bindings';

import { ROLES_LEDGER_DID } from '../../../../deploy/000_deployRolesLedger';
import { BEETHOVEN_PRICE_ORACLE_DID } from '../../../../deploy/oracles/203_deployBeethovenXPriceOracle';
import { CONFIG_BEETS_ORACLE } from '../../../../deploy/oracles/configPriceOracles/BEETS';
import { CONFIG_USDC_ORACLE } from '../../../../deploy/oracles/configPriceOracles/USDC';
import { ORACLE_TESTS_BLOCK_NUMBER } from '../../../helpers/constants';
import { BPO_UNKOWN_TOKEN, RBAC_CALLER_NOT_ADMIN } from '../../../helpers/errors';
import { fork, getChainId } from '../../../helpers/fork';
import { getPriceDenominatedIn } from '../../../helpers/prices';

import { BeethovenX, getContractAddress, Tokens } from '~common/config';

const { deployments } = hre;

const USDC_WFTM_BTC_ETH_POOL = '0xf3A602d30dcB723A74a0198313a7551FEacA7DAc';
const WETH_USDC_POOL = '0xA07De66AeF84e2c01D88a48D57D1463377Ee602b';

describe('Balancer V2 Price Oracle', function () {
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;
  let oracle: BalV2PriceOracle;
  let roles: RolesLedger;
  let BEETS: string;
  let FIDELIO_DUETTO: string;
  let BASE_TOKEN: string;
  let WETH: string;
  let USDC: string;
  let COMB: string;

  before(async function () {
    [deployer, user] = await hre.ethers.getSigners();
  });

  beforeEach(async function () {
    await fork('fantom', ORACLE_TESTS_BLOCK_NUMBER, hre);
    BEETS = getContractAddress(Tokens.BEETS, getChainId());
    WETH = getContractAddress(Tokens.WETH, getChainId());
    USDC = getContractAddress(Tokens.USDC, getChainId());
    COMB = getContractAddress(Tokens.COMB, getChainId());
    FIDELIO_DUETTO = getContractAddress(BeethovenX.FIDELIO_DUETTO, getChainId());
    await deployments.fixture([BEETHOVEN_PRICE_ORACLE_DID, CONFIG_BEETS_ORACLE, CONFIG_USDC_ORACLE]);
    oracle = await connect(BEETHOVEN_PRICE_ORACLE_DID, hre);
    roles = await connect(ROLES_LEDGER_DID, hre);
    BASE_TOKEN = await oracle.BASE_TOKEN();
    await roles.grantRole(await roles.ADMIN(), deployer.address);
  });

  it('Should revert if non-admin setTokenOracle', async function () {
    await expect(oracle.connect(user).setTokenOracle(BEETS, FIDELIO_DUETTO)).to.revertedWith(RBAC_CALLER_NOT_ADMIN);
  });

  it('Should revert if not a 2 token pool', async function () {
    await expect(oracle.setTokenOracle(BEETS, USDC_WFTM_BTC_ETH_POOL)).to.revertedWith('INVALID POOL');
  });

  it("Should revert if token isn't in pool", async function () {
    await expect(oracle.setTokenOracle(USDC, FIDELIO_DUETTO)).to.revertedWith('Token is not in pool');
  });

  it('Should let admin set oracle settings', async function () {
    await oracle.setTokenOracle(BEETS, FIDELIO_DUETTO);

    expect(await oracle.tokenPools(BEETS)).to.equal(FIDELIO_DUETTO);
  });

  it("Should revert if token isn't set", async function () {
    await expect(oracle.getCurrentPrice(WETH)).to.revertedWith(BPO_UNKOWN_TOKEN);
    await expect(oracle.getSafePrice(WETH)).to.revertedWith(BPO_UNKOWN_TOKEN);
    await expect(oracle.updateSafePrice(WETH)).to.revertedWith(BPO_UNKOWN_TOKEN);
  });

  describe('Token pooled with base token', function () {
    it('Should be able to get current price', async function () {
      const price = await oracle.getCurrentPrice(BEETS);
      const externalPrice = await getPriceDenominatedIn(BEETS, BASE_TOKEN);
      expect(price).to.be.closeTo(externalPrice, price.mul(2).div(100) as any); // 2% diff
    });

    it('Should be able to get safe price', async function () {
      const price = await oracle.getSafePrice(BEETS);
      const externalPrice = await getPriceDenominatedIn(BEETS, BASE_TOKEN);
      expect(price).to.be.closeTo(externalPrice, price.mul(2).div(100) as any); // 2% diff
    });

    it('Should be able to update safe price', async function () {
      await oracle.updateSafePrice(BEETS);
    });
  });

  describe('Token in pool with not a base token', function () {
    beforeEach(async function () {
      await oracle.setTokenOracle(WETH, WETH_USDC_POOL);
    });

    it('Should be able to get current price', async function () {
      const price = await oracle.getCurrentPrice(WETH);
      const priceFromCoingecko = await getPriceDenominatedIn(WETH, BASE_TOKEN);
      expect(price).to.be.closeTo(priceFromCoingecko, price.mul(2).div(100) as any); // 4% diff
    });

    /**
     * Skipping this test for now, cause I can't find a pool with an active oracle
     * **/
    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip('Should be able to get safe price', async function () {
      const price = await oracle.getSafePrice(COMB);
      const externalPrice = await getPriceDenominatedIn(COMB, BASE_TOKEN);
      console.log('safe price from oracle = ', price.toString());
      console.log('price from coingecko = ', externalPrice.toString());
      expect(price).to.be.closeTo(externalPrice, price.mul(2).div(100) as any); // 4% diff
    });

    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip('Should be able to update safe price', async function () {
      await oracle.updateSafePrice(COMB);
    });
  });
});
