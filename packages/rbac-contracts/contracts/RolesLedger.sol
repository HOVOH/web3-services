// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * RolesLedger is a registry for roles meant to be a singleton
 */

contract RolesLedger is AccessControl {
  bytes32 public constant DAEMON = keccak256("daemon");
  bytes32 public constant ADMIN = keccak256("admin");
  bytes32 public constant ROOT = DEFAULT_ADMIN_ROLE;
  address public rootAddress;
  address public nextRoot;

  event RootPushed(address indexed _from, address indexed _to);
  event RootPulled(address indexed _from, address indexed _to);

  constructor(address _root) {
    rootAddress = _root;
    _grantRole(ROOT, _root);
  }

  modifier onlyRoot() {
    require(msg.sender == rootAddress, "RL: caller is not root");
    _;
  }

  function pushRoot(address _newRoot) external onlyRoot {
    nextRoot = _newRoot;
    emit RootPushed(rootAddress, _newRoot);
  }

  function isRoot(address _address) public view returns (bool) {
    return hasRole(ROOT, _address);
  }

  function pullRoot() external {
    require(msg.sender == nextRoot, "not next root");
    _grantRole(ROOT, nextRoot);
    _revokeRole(ROOT, rootAddress);
    emit RootPulled(rootAddress, nextRoot);
    rootAddress = nextRoot;
  }

    function isAdmin(address _address) external view returns(bool) {
        return hasRole(ADMIN, _address);
    }

    function isDaemon(address _address) external view returns (bool) {
        return hasRole(DAEMON, _address);
    }
}
