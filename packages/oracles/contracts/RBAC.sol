// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "./RolesLedger.sol";

/**
 * The RBAC let contract implement role based
 * permission using the ExodiaRoles contract.
 * It adds the Machine role on a per contract basis.
 * The Machine role is intended to be used if the contract can only be called from another
 * contract or by a keeper we know the address.
 */
abstract contract RBAC {
  RolesLedger public roles;
  mapping(address => bool) processes;

  function setRolesLedger(address _roles) external onlyAdmins {
    _setRolesLedger(_roles);
  }

  function _setRolesLedger(address _roles) internal {
    require(_roles != address(0), "roles cannot be null address");
    roles = RolesLedger(_roles);
  }

  function getRolesLedger() external view returns (address) {
    return address(roles);
  }

  function _getRoles() internal view returns (RolesLedger) {
    return roles;
  }

  function addProcess(address _address) external onlyAdmins {
    processes[_address] = true;
  }

  function removeProcess(address _address) external onlyAdmins {
    processes[_address] = false;
  }

  function isProcess(address _address) external view returns (bool) {
    return processes[_address];
  }

  modifier onlyProcesses() {
    require(processes[msg.sender], "RBAC: caller is not a process");
    _;
  }

  function _isAdmin(address _address) internal view returns (bool) {
    return roles.isAdmin(_address);
  }

  modifier onlyAdmins() {
    require(_isAdmin(msg.sender), "RBAC: caller is not an admin");
    _;
  }

  function _isDaemon(address _address) internal view returns (bool) {
    return roles.isDaemon(_address);
  }

  modifier onlyDaemons() {
    require(_isDaemon(msg.sender), "RBAC: caller is not a daemon");
    _;
  }
}
