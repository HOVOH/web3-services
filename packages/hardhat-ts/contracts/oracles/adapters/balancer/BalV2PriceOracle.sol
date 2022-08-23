// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

import "../IPriceOracle.sol";
import "../../interfaces/IBalV2PriceOracle.sol";
import "../../interfaces/IBalVaultV2.sol";
import "../../interfaces/IBalPoolV2.sol";
import "../../IPriceProvider.sol";
import "../../../RBAC.sol";
import "hardhat/console.sol";

contract BalV2PriceOracle is IPriceOracle, RBAC {
  uint256 public constant VERSION = 1;

  IPriceProvider public priceProvider;
  address public immutable vault;
  uint256 public timeLength = 5 minutes;
  uint256 public lastSample = 3 minutes;
  mapping(address => address) public tokenPools; // token => balancer pool

  event SetTokenOracle(address indexed token, address indexed tokenPool);

  /**
   * @dev sets up the Price Oracle
   * @param _priceProvider price provider to get the BASE_TOKEN and Roles Ledger
   * @param _vault balancer vault address
   * @param _timeLength how long is the twap taken on in seconds
   * @param _lastSample when is the last sample used
   */
  constructor(
    address _priceProvider,
    address _vault,
    uint256 _timeLength,
    uint256 _lastSample
  ) {
    require(_vault != address(0), "vault cannot be null address");
    _setRolesLedger(RBAC(_priceProvider).getRolesLedger());
    priceProvider = IPriceProvider(_priceProvider);
    vault = _vault;
    timeLength = _timeLength;
    lastSample = _lastSample;
  }

  /**
   * @dev add/update token oracle setting
   */
  function setTokenOracle(address _token, address _tokenPool) external onlyAdmins {
    bytes32 poolId = IBalPoolV2(_tokenPool).getPoolId();
    (IERC20[] memory tokens, , ) = IBalVaultV2(vault).getPoolTokens(poolId);

    // Balancer oracle is only available for 2 token pools
    require(tokens.length == 2, "INVALID POOL");
    // Verify that the LP has the target token
    require(_token != priceProvider.BASE_TOKEN() && (_token == address(tokens[0]) || _token == address(tokens[1])), "Token is not in pool");
    tokenPools[_token] = _tokenPool;

    emit SetTokenOracle(_token, _tokenPool);
  }

  /****** OPERATIONAL METHODS ******/

  /**
   * @dev returns the TWAP for the provided pair as of the last update
   */
  function getSafePrice(address _token) public view returns (uint256) {
    require(tokenPools[_token] != address(0), "BPO: unkown token");
    IBalV2PriceOracle.OracleAverageQuery[] memory queries = new IBalV2PriceOracle.OracleAverageQuery[](1);
    queries[0] = IBalV2PriceOracle.OracleAverageQuery(IBalV2PriceOracle.TWAP_VALUE.PAIR_PRICE, timeLength, lastSample);
    uint256[] memory prices = IBalV2PriceOracle(tokenPools[_token]).getTimeWeightedAverage(queries);
    uint256 tokenPairPrice = prices[0];
    bytes32 poolId = IBalPoolV2(tokenPools[_token]).getPoolId();
    (IERC20[] memory tokens, , ) = IBalVaultV2(vault).getPoolTokens(poolId);
    if (_token == address(tokens[0])) {
      return (priceProvider.getSafePrice(address(tokens[1])) * (10**18)) / tokenPairPrice;
    }
    return (priceProvider.getSafePrice(address(tokens[0])) * tokenPairPrice) / (10**18);
  }

  /**
   * @dev returns the current "unsafe" price that can be easily manipulated
   */
  function getCurrentPrice(address _token) external view returns (uint256 price) {
    require(tokenPools[_token] != address(0), "BPO: unkown token");
    // TODO: refactor with
    // uint256[] memory prices = IBalV2PriceOracle(tokenPools[_token]).getLatest(IBalV2PriceOracle.TWAP_VALUE.PAIR_PRICE);
    bytes32 poolId = IBalPoolV2(tokenPools[_token]).getPoolId();
    uint256[] memory weights = IBalPoolV2(tokenPools[_token]).getNormalizedWeights();
    (IERC20[] memory tokens, uint256[] memory balances, ) = IBalVaultV2(vault).getPoolTokens(poolId);

    if (_token == address(tokens[0])) {
      price = _tokenPriceFromWeights(tokens[0], tokens[1], balances[0], balances[1], weights[0], weights[1]);
    } else if (_token == address(tokens[1])) {
      price = _tokenPriceFromWeights(tokens[1], tokens[0], balances[1], balances[0], weights[1], weights[0]);
    }
  }

  /**
   * @dev updates the TWAP (if enough time has lapsed) and returns the current safe price
   */
  function updateSafePrice(address _token) external returns (uint256) {
    return getSafePrice(_token);
  }

  // internal functions

  /**
   * @dev return token price (token0/token1)
   */
  function _tokenPriceFromWeights(
    IERC20 token0,
    IERC20 token1,
    uint256 balance0,
    uint256 balance1,
    uint256 weight0,
    uint256 weight1
  ) internal view returns (uint256) {
    uint256 price1 = priceProvider.getCurrentPrice(address(token1));

    // price = balance1 / balance0 * weight0 / weight1 * usdPrice1
    // TVL = balance0
    // in denominated token price decimals
    uint256 assetValue = (balance1 * price1) / (10**ERC20(address(token1)).decimals());
    // in denominated token price decimals
    return (assetValue * weight0 * (10**ERC20(address(token0)).decimals())) / weight1 / balance0;
  }

  function BASE_TOKEN() public view returns (address) {
    return priceProvider.BASE_TOKEN();
  }
}
