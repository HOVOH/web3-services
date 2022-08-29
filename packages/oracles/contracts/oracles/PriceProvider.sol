// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./adapters/IPriceOracle.sol";
import "./IPriceProvider.sol";
import "../RBAC.sol";

error NoOracle(address _token);

contract PriceProvider is IPriceProvider, RBAC {
  event SetTokenOracle(address token, address oracle);
  address public immutable BASE_TOKEN;
  uint8 immutable DECIMALS;
  mapping(address => address) public priceOracle;

  event PriceUpdated(address indexed _token, uint256 _price);

  /**
   * @dev sets up the Price Oracle
   * @param _roles exodia roles address
   */
  constructor(
    address _baseToken,
    uint8 _decimals,
    address _roles
  ) {
    _setRolesLedger(_roles);
    DECIMALS = _decimals;
    BASE_TOKEN = _baseToken;
  }

  function setTokenOracle(address token, address oracle) external onlyAdmins {
    priceOracle[token] = oracle;

    emit SetTokenOracle(token, oracle);
  }

  function getSafePrice(address token) external view override returns (uint256) {
    return _getSafePrice(token);
  }

  function _getSafePrice(address token) internal view returns (uint256) {
    if (token == BASE_TOKEN) {
      return 10**DECIMALS;
    }
    address oracle = priceOracle[token];
    if (oracle == address(0)) {
      revert NoOracle(token);
    }
    return IPriceOracle(priceOracle[token]).getSafePrice(token);
  }

  function getSafePriceDenominatedIn(address token0, address token1) external view returns (uint256) {
    return (_getSafePrice(token0) * 10**DECIMALS) / _getSafePrice(token1);
  }

  function getCurrentPrice(address token) external view override returns (uint256) {
    return _getCurrentPrice(token);
  }

  function _getCurrentPrice(address token) internal view returns (uint256) {
    if (token == BASE_TOKEN) {
      return 10**DECIMALS;
    }
    address oracle = priceOracle[token];
    if (oracle == address(0)) {
      revert NoOracle(token);
    }
    return IPriceOracle(priceOracle[token]).getCurrentPrice(token);
  }

  function getCurrentPriceDenominatedIn(address token0, address token1) external view returns (uint256) {
    return (_getCurrentPrice(token0) * 10**DECIMALS) / _getCurrentPrice(token1);
  }

  function updateSafePrice(address token) external override returns (uint256) {
    if (token == BASE_TOKEN) {
      return 10**DECIMALS;
    }
    address oracle = priceOracle[token];
    if (oracle == address(0)) {
      revert NoOracle(token);
    }
    uint256 price = IPriceOracle(priceOracle[token]).updateSafePrice(token);
    emit PriceUpdated(token, price);
    return price;
  }
}
