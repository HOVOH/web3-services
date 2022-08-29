// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "../IPriceOracle.sol";
import "../../../RBAC.sol";

contract ChainlinkPriceOracle is IPriceOracle, RBAC {
  uint256 public constant VERSION = 1;

  address public BASE_PRICE_FEED;
  address public immutable BASE_TOKEN;

  uint8 public decimals = 18;

  mapping(address => address) public priceFeed; // token => chainlink price feed

  event UpdateValues(address indexed feed);
  event OutputDecimalsUpdated(uint8 _old, uint8 _new);
  event SetPriceFeed(address indexed token, address indexed feed);

  constructor(
    address _roles,
    address _base_price_feed,
    address _baseToken
  ) {
    require(_base_price_feed != address(0), "CLPO: BASE PRICE FEED cannot be the null address");
    BASE_TOKEN = _baseToken;
    BASE_PRICE_FEED = _base_price_feed;
    _setRolesLedger(_roles);
  }

  function setPriceFeed(address _token, address _feed) external onlyAdmins {
    priceFeed[_token] = _feed;

    emit SetPriceFeed(_token, _feed);
  }

  function getSafePrice(address _token) public view returns (uint256 _amountOut) {
    return getCurrentPrice(_token);
  }

  function getCurrentPrice(address _token) public view returns (uint256 _amountOut) {
    require(priceFeed[_token] != address(0), "CLPO: no price feed");

    _amountOut = _divide(_feedPrice(priceFeed[_token]), _feedPrice(BASE_PRICE_FEED), decimals);
  }

  function setOutputDecimals(uint8 _decimals) public onlyAdmins {
    uint8 _old = _decimals;
    decimals = _decimals;
    emit OutputDecimalsUpdated(_old, _decimals);
  }

  function updateSafePrice(address _feed) public returns (uint256 _amountOut) {
    emit UpdateValues(_feed); // keeps this mutable so it matches the interface

    return getCurrentPrice(_feed);
  }

  /****** INTERNAL METHODS ******/

  /**
   * @dev internal method that does quick division using the set precision
   */
  function _divide(
    uint256 a,
    uint256 b,
    uint8 precision
  ) internal pure returns (uint256) {
    return (a * (10**precision)) / b;
  }

  function _feedPrice(address _feed) internal view returns (uint256 latestUSD) {
    (, int256 _latestUSD, , , ) = AggregatorV3Interface(_feed).latestRoundData();
    return uint256(_latestUSD);
  }
}
