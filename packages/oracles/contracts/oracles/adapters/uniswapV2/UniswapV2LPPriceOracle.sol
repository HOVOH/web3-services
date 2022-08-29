// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

import "../IPriceOracle.sol";
import "../../IPriceProvider.sol";
import "../../../RBAC.sol";

contract UniswapV2LPPriceOracle is IPriceOracle, RBAC, Initializable {
  uint256 public constant VERSION = 1;
  uint256 public constant MAX_SPREAD_BASIS = 100_00;
  IPriceProvider public priceProvider;
  uint256 public toleratedSpread;

  event TokenOracleUpdated(address indexed token, address indexed token0Oracle, address indexed token1Oracle);
  event ToleratedSpreadUpdated(uint256 spread);

  constructor(address _priceProvider) {
    priceProvider = IPriceProvider(_priceProvider);
    _setRolesLedger(RBAC(_priceProvider).getRolesLedger());
  }

  /**
   * @dev set ratio difference limit
   */
  function setToleratedSpread(uint256 _toleratedSpread) external onlyAdmins {
    require(_toleratedSpread <= MAX_SPREAD_BASIS, "ULPPO: value needs to be less than 10000");

    toleratedSpread = _toleratedSpread;

    emit ToleratedSpreadUpdated(toleratedSpread);
  }

  /****** OPERATIONAL METHODS ******/

  /**
   * @dev returns the TWAP for the provided pair as of the last update
   */
  function getSafePrice(address _lpToken) public view returns (uint256) {
    return _getLPPrice(_lpToken, true);
  }

  /**
   * @dev returns the current "unsafe" price that can be easily manipulated
   */
  function getCurrentPrice(address _lpToken) external view returns (uint256) {
    return _getLPPrice(_lpToken, false);
  }

  /**
   * @dev updates the TWAP (if enough time has lapsed) and returns the current safe price
   */
  function updateSafePrice(address _lpToken) external returns (uint256) {
    return getSafePrice(_lpToken);
  }

  // internal functions

  function _getLPPrice(address _lpToken, bool isSafePrice) internal view returns (uint256 price) {
    ERC20 token0 = ERC20(IUniswapV2Pair(_lpToken).token0());
    ERC20 token1 = ERC20(IUniswapV2Pair(_lpToken).token1());
    uint256 price0 = isSafePrice ? priceProvider.getSafePrice(address(token0)) : priceProvider.getCurrentPrice(address(token0));
    uint256 price1 = isSafePrice ? priceProvider.getSafePrice(address(token1)) : priceProvider.getCurrentPrice(address(token1));

    uint256 totalSupply = IUniswapV2Pair(_lpToken).totalSupply();
    (uint256 reserve0, uint256 reserve1, ) = IUniswapV2Pair(_lpToken).getReserves();
    uint256 decimal0 = token0.decimals();
    uint256 decimal1 = token1.decimals();

    reserve0 = (reserve0 * (10**18)) / (10**decimal0);
    reserve1 = (reserve1 * (10**18)) / (10**decimal1);

    _checkRatio(reserve0, reserve1, price0, price1);

    price = (reserve0 * price0 + reserve1 * price1) / totalSupply;
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

    require(value1 < value0 + diffLimit && value0 < value1 + diffLimit, "ULPPO: spread is greater than tolerated spread");
  }

  function BASE_TOKEN() public view returns (address) {
    return priceProvider.BASE_TOKEN();
  }
}
