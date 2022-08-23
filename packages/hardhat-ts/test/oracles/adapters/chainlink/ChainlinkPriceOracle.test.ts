import { expect } from 'chai';
import { ChainlinkPriceOracle, RolesLedger } from 'generated/contract-types';
import hre from 'hardhat';
import { SignerWithAddress } from 'hardhat-deploy-ethers/signers';
import { connect } from 'helpers/bindings';
import { TNetworkConfig } from 'helpers/types/TNetworkConfig';

import { ROLES_LEDGER_DID } from '../../../../deploy/000_deployRolesLedger';
import { CHAINLINK_PRICE_ORACLE_DID } from '../../../../deploy/oracles/205_deployChainlinkPriceOracle';
import { ORACLE_TESTS_BLOCK_NUMBER } from '../../../helpers/constants';
import { CL_NO_FEED, RBAC_CALLER_NOT_ADMIN } from '../../../helpers/errors';
import { fork } from '../../../helpers/fork';
import { getPriceDenominatedIn } from '../../../helpers/prices';

import { ChainlinkFeed, getContractAddress, Tokens } from '~common/config';

const { deployments } = hre;

describe('Chainlink Price Oracle', function () {
  let chain: TNetworkConfig;
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;
  let admin: SignerWithAddress;
  let oracle: ChainlinkPriceOracle;
  let roles: RolesLedger;
  let DAI: string;
  let DAI_USD_FEED: string;
  let WBTC: string;
  let BTC_USD_FEED: string;
  let BASE_TOKEN: string;

  beforeEach(async function () {
    [deployer, user, admin] = await hre.ethers.getSigners();
    chain = await fork('fantom', ORACLE_TESTS_BLOCK_NUMBER, hre);
    DAI = getContractAddress(Tokens.DAI, chain.chainId);
    DAI_USD_FEED = getContractAddress(ChainlinkFeed.DAI, chain.chainId);
    WBTC = getContractAddress(Tokens.WBTC, chain.chainId);
    BTC_USD_FEED = getContractAddress(ChainlinkFeed.BTC, chain.chainId);
    BASE_TOKEN = getContractAddress(Tokens.WFTM, chain.chainId);

    await deployments.fixture([CHAINLINK_PRICE_ORACLE_DID, ROLES_LEDGER_DID]);
    oracle = await connect(CHAINLINK_PRICE_ORACLE_DID, hre);
    roles = await connect(ROLES_LEDGER_DID, hre);

    await roles.grantRole(await roles.ADMIN(), admin.address);
  });

  it('Should throw an error if non admin set price feed', async function () {
    await expect(oracle.connect(user).setPriceFeed(DAI, DAI_USD_FEED)).to.revertedWith(RBAC_CALLER_NOT_ADMIN);
  });

  it('Should set a price feed', async function () {
    await oracle.connect(admin).setPriceFeed(DAI, DAI_USD_FEED);
    expect(await oracle.priceFeed(DAI)).to.equal(DAI_USD_FEED);
  });

  it('Should throw an error if the feed is not set', async function () {
    await expect(oracle.getCurrentPrice(deployer.address)).to.revertedWith(CL_NO_FEED);
    await expect(oracle.getSafePrice(deployer.address)).to.revertedWith(CL_NO_FEED);
    await expect(oracle.updateSafePrice(deployer.address)).to.revertedWith(CL_NO_FEED);
  });

  describe('After token oracle setting: DAI-BASE_TOKEN (18 decimals)', function () {
    beforeEach(async function () {
      await oracle.connect(admin).setPriceFeed(DAI, DAI_USD_FEED);
    });

    it('Should be able to get current price', async function () {
      const price = await oracle.getCurrentPrice(DAI);
      const externalPrice = await getPriceDenominatedIn(DAI, BASE_TOKEN);
      expect(price).to.be.closeTo(externalPrice, price.mul(2).div(100) as any); // 2% diff
    });

    it('Should be able to get safe price', async function () {
      const price = await oracle.getSafePrice(DAI);
      const externalPrice = await getPriceDenominatedIn(DAI, BASE_TOKEN);
      expect(price).to.be.closeTo(externalPrice, price.mul(2).div(100) as any); // 2% diff
    });

    it('Should be able to update safe price', async function () {
      await oracle.updateSafePrice(DAI);
    });
  });

  describe('After token oracle setting: WBTC-BASE_TOKEN (6 decimals)', function () {
    beforeEach(async function () {
      await oracle.connect(admin).setPriceFeed(WBTC, BTC_USD_FEED);
    });

    it('Should be able to get current price', async function () {
      const price = await oracle.getCurrentPrice(WBTC);
      const externalPrice = await getPriceDenominatedIn(WBTC, BASE_TOKEN);
      expect(price).to.be.closeTo(externalPrice, price.mul(2).div(100) as any); // 2% diff
    });

    it('Should be able to get safe price', async function () {
      const price = await oracle.getSafePrice(WBTC);
      const externalPrice = await getPriceDenominatedIn(WBTC, BASE_TOKEN);
      expect(price).to.be.closeTo(externalPrice, price.mul(2).div(100) as any); // 2% diff
    });

    it('Should be able to update safe price', async function () {
      await oracle.updateSafePrice(WBTC);
    });
  });
});
