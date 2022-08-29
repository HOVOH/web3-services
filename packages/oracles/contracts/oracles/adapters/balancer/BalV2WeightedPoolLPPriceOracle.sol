// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "../IPriceOracle.sol";
import "../../IPriceProvider.sol";
import "../../interfaces/IBalV2PriceOracle.sol";
import "../../interfaces/IBalPoolV2.sol";
import "../../interfaces/IBalVaultV2.sol";
import "../../../RBAC.sol";

contract BalV2WeightedPoolLPPriceOracle is IPriceOracle, RBAC {
  uint256 public constant VERSION = 1;
  address public immutable BASE_TOKEN;

  IPriceProvider public priceProvider;
  uint256 public toleratedSpread;
  uint256 public constant MAX_SPREAD_BASIS = 100_00;

  event ToleratedSpreadUpdated(uint256 spread);

  /**
   * @dev sets up the Price Oracle
   *  @param _priceProvider price provider
   */
  constructor(address _priceProvider) {
    require(_priceProvider != address(0), "price provider cannot be null address");

    priceProvider = IPriceProvider(_priceProvider);
    BASE_TOKEN = priceProvider.BASE_TOKEN();
    _setRolesLedger(RBAC(_priceProvider).getRolesLedger());
  }

  /**
   * @dev set ratio difference limit
   */
  function setToleratedSpread(uint256 _spread) external onlyAdmins {
    require(_spread <= MAX_SPREAD_BASIS, "BWPLP: invalid spread");

    toleratedSpread = _spread;

    emit ToleratedSpreadUpdated(_spread);
  }

  /****** OPERATIONAL METHODS ******/

  /**
   * @dev returns the TWAP for the provided pair as of the last update
   */
  function getSafePrice(address _bpt) public view returns (uint256) {
    return _getLPPrice(_bpt, true);
  }

  /**
   * @dev returns the current "unsafe" price that can be easily manipulated
   */
  function getCurrentPrice(address _bpt) external view returns (uint256) {
    return _getLPPrice(_bpt, false);
  }

  /**
   * @dev updates the TWAP (if enough time has lapsed) and returns the current safe price
   */
  function updateSafePrice(address _bpt) external returns (uint256) {
    return _getLPPrice(_bpt, true);
  }

  // internal functions

  function _getTokenSafePrice(address token) internal view returns (uint256 price) {
    price = 10**18;
    if (BASE_TOKEN != token) {
      price = priceProvider.getSafePrice(token);
    }
  }

  function _getTokenCurrentPrice(address token) internal view returns (uint256 price) {
    price = 10**18;
    if (BASE_TOKEN != token) {
      price = priceProvider.getCurrentPrice(token);
    }
  }

  function _getLPPrice(address _bpt, bool isSafePrice) internal view returns (uint256 price) {
    IBalPoolV2 pool = IBalPoolV2(_bpt);
    bytes32 poolId = pool.getPoolId();
    uint256[] memory weights = pool.getNormalizedWeights();
    uint256 totalSupply = pool.totalSupply();
    IBalVaultV2 vault = IBalVaultV2(pool.getVault());
    (IERC20[] memory tokens, uint256[] memory balances, ) = vault.getPoolTokens(poolId);

    uint256 baseTokenValue = 0;
    uint256[] memory prices = new uint256[](tokens.length);
    // update balances in 18 decimals
    for (uint256 i = 0; i < tokens.length; i++) {
      balances[i] = (balances[i] * (10**18)) / (10**ERC20(address(tokens[i])).decimals());
      prices[i] = isSafePrice ? _getTokenSafePrice(address(tokens[i])) : _getTokenCurrentPrice(address(tokens[i]));

      if (i >= 1) {
        _checkRatio((balances[i - 1] * 10**18) / weights[i - 1], (balances[i] * 10**18) / weights[i], prices[i - 1], prices[i]);
      }

      baseTokenValue += balances[i] * prices[i];
    }

    price = baseTokenValue / totalSupply;
  }

  function _checkRatio(
    uint256 reserve0,
    uint256 reserve1,
    uint256 price0,
    uint256 price1
  ) internal view {
    uint256 value0 = reserve0 * price0;
    uint256 value1 = reserve1 * price1;
    uint256 diffLimit = (value0 * toleratedSpread) / MAX_SPREAD_BASIS;

    require(value1 < value0 + diffLimit && value0 < value1 + diffLimit, "BWPLPPO: spread threshold reached");
  }
}
