/* eslint-disable @typescript-eslint/no-unused-expressions */
import '../helpers/hardhat-imports';
import './helpers/chai-imports';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { RolesLedger } from 'generated/contract-types';
import hre from 'hardhat';
import { connect } from 'helpers/bindings';

import { ROLES_LEDGER_DID } from '../deploy/000_deployRolesLedger';

import { ROLES_NOT_ROOT } from './helpers/errors';
const { deployments, getNamedAccounts, getUnnamedAccounts } = hre;

describe('RolesLedger', function () {
  let deployer: SignerWithAddress;
  let noRole: SignerWithAddress;
  let root: SignerWithAddress;
  let admin: SignerWithAddress;
  let accounts: string[];
  const ROOT = 0;
  const ADMIN = 1;
  const NO_ROLE = 3;

  let roles: RolesLedger;

  beforeEach(async function () {
    const { deployer: deployerAddress } = await getNamedAccounts();
    accounts = await getUnnamedAccounts();
    deployer = await hre.ethers.getSigner(deployerAddress);
    noRole = await hre.ethers.getSigner(accounts[NO_ROLE]);
    root = await hre.ethers.getSigner(accounts[ROOT]);
    admin = await hre.ethers.getSigner(accounts[ADMIN]);
    await deployments.fixture([ROLES_LEDGER_DID]);
    roles = await connect(ROLES_LEDGER_DID, hre);
  });

  it('Should deploy the roles ledger', async () => {
    const rootAddress = await roles.rootAddress();
    expect(rootAddress).to.equal(deployer.address);
  });

  it('Should return true if root, false if not', async () => {
    expect(await roles.isRoot(deployer.address)).to.be.true;
    expect(await roles.isRoot(noRole.address)).to.be.false;
  });

  it('Should transfer root', async () => {
    await roles.pushRoot(root.address);
    await roles.connect(root).pullRoot();
    expect(await roles.isRoot(root.address)).to.be.true;
    expect(await roles.isRoot(deployer.address)).to.be.false;
    expect(await roles.hasRole(await roles.ROOT(), deployer.address)).to.be.false;
    expect(await roles.hasRole(await roles.ROOT(), root.address)).to.be.true;
  });

  it('Should add an account to a role', async () => {
    const adminRole = await roles.ADMIN();
    await roles.grantRole(adminRole, admin.address);
    expect(await roles.hasRole(adminRole, admin.address));
  });

  it('Should remove an account to a role', async () => {
    const adminRole = await roles.ADMIN();
    await roles.grantRole(adminRole, admin.address);
    await roles.revokeRole(adminRole, admin.address);
    expect(await roles.hasRole(adminRole, admin.address));
  });

  it('Should net let other push root', async () => {
    await expect(roles.connect(noRole).pushRoot(noRole.address)).to.be.revertedWith(ROLES_NOT_ROOT);
  });

  it('Should net let other pull root', async () => {
    await expect(roles.connect(admin).pullRoot()).to.be.revertedWith('not next root');
  });
});
