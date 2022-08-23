import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { MockPriceOracle, MockPriceOracle__factory, PriceProvider } from 'generated/contract-types';
import hre from 'hardhat';
import { connect } from 'helpers/bindings';
import '../helpers/chai-imports';

import { ROLES_LEDGER_DID } from '../../deploy/000_deployRolesLedger';
import { getBaseToken, PRICE_PROVIDER_DID } from '../../deploy/oracles/100_deployPriceProvider';
import { PP_NO_ORACLE, RBAC_CALLER_NOT_ADMIN } from '../helpers/errors';
import { getChainId } from '../helpers/fork';

import { getContractAddress, Tokens } from '~common/config';

const { deployments } = hre;
const DAI_PRICE = BigNumber.from(1000);
const GOHM_PRICE = BigNumber.from(2000);
const GOHM_DAI_PRICE = GOHM_PRICE.mul(BigNumber.from(10).pow(18)).div(DAI_PRICE);
describe('PriceProvider', function () {
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;
  let oracle0: MockPriceOracle;
  let oracle1: MockPriceOracle;
  let priceProvider: PriceProvider;
  let DAI: string;
  let BASE_TOKEN: string;
  let GOHM: string;

  before(async function () {
    [deployer, user] = await hre.ethers.getSigners();
    DAI = getContractAddress(Tokens.DAI, 250);
    BASE_TOKEN = getBaseToken(getChainId());
    GOHM = getContractAddress(Tokens.GOHM, 250);
  });

  beforeEach(async function () {
    await deployments.fixture([PRICE_PROVIDER_DID]);
    const roles = await connect(ROLES_LEDGER_DID, hre);
    await roles.grantRole(await roles.ADMIN(), deployer.address);

    priceProvider = await connect(PRICE_PROVIDER_DID, hre);
    const oracleFactory = await hre.ethers.getContractFactory('MockPriceOracle');
    const oracle0Deploy = await oracleFactory.deploy(DAI_PRICE);
    const oracle1Deploy = await oracleFactory.deploy(GOHM_PRICE);
    oracle0 = MockPriceOracle__factory.connect(oracle0Deploy.address, deployer);
    oracle1 = MockPriceOracle__factory.connect(oracle1Deploy.address, deployer);
  });

  it('Only architect can set token oracle settings', async function () {
    await expect(priceProvider.connect(user).setTokenOracle(DAI, oracle0.address)).to.revertedWith(RBAC_CALLER_NOT_ADMIN);
  });

  it('Should revert with custom error', async function () {
    const ADDY = '0x0000000000000000000000000000000000000001';
    await expect(priceProvider.getSafePrice(ADDY)).to.be.revertedWith(PP_NO_ORACLE).withArgs(ADDY);
  });

  it('getCurrentPrice should throw error if not configured', async () => {
    await expect(priceProvider.getCurrentPrice(DAI)).to.be.revertedWith(PP_NO_ORACLE).withArgs(DAI);
  });

  it('getSafePrice should throw error if not configured', async () => {
    await expect(priceProvider.getSafePrice(DAI)).to.be.revertedWith(PP_NO_ORACLE).withArgs(DAI);
  });

  it('updateSafePrice should throw error if not configured', async () => {
    await expect(priceProvider.callStatic.updateSafePrice(DAI)).to.be.revertedWith(PP_NO_ORACLE).withArgs(DAI);
  });

  describe('After token setted', function () {
    beforeEach(async function () {
      await priceProvider.setTokenOracle(DAI, oracle0.address);
      await priceProvider.setTokenOracle(GOHM, oracle1.address);
    });

    it('Should be able to get current price', async function () {
      expect(await priceProvider.getCurrentPrice(DAI)).to.equal(DAI_PRICE);
      expect(await priceProvider.getCurrentPriceDenominatedIn(GOHM, DAI)).to.equal(GOHM_DAI_PRICE);
      expect(await priceProvider.getCurrentPrice(GOHM)).to.equal(GOHM_PRICE);
      expect(await priceProvider.getCurrentPrice(BASE_TOKEN)).to.equal(parseUnits('1', 'ether'));
    });

    it('Should be able to get safe price', async function () {
      expect(await priceProvider.getSafePrice(DAI)).to.equal(DAI_PRICE);
      expect(await priceProvider.getSafePriceDenominatedIn(GOHM, DAI)).to.equal(GOHM_DAI_PRICE);
      expect(await priceProvider.getSafePrice(GOHM)).to.equal(GOHM_PRICE);
      expect(await priceProvider.getSafePrice(BASE_TOKEN)).to.equal(parseUnits('1', 'ether'));
    });

    it('updateSafePrice should return price', async function () {
      expect(await priceProvider.callStatic.updateSafePrice(DAI)).to.equal(DAI_PRICE);
      expect(await priceProvider.callStatic.updateSafePrice(GOHM)).to.equal(GOHM_PRICE);
      expect(await priceProvider.callStatic.updateSafePrice(BASE_TOKEN)).to.equal(parseUnits('1', 'ether'));
    });

    it('updateSafePrice should emit an event', async function () {
      await expect(priceProvider.updateSafePrice(DAI)).to.emit(priceProvider, 'PriceUpdated').withArgs(DAI, DAI_PRICE);
    });
  });
});
