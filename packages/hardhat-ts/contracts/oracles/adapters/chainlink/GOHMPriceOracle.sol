// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "../IPriceOracle.sol";

contract GOHMPriceOracle is IPriceOracle {
  AggregatorV3Interface immutable ohmFeed;
  AggregatorV3Interface immutable indexFeed;
  AggregatorV3Interface immutable baseFeed;
  address public immutable BASE_TOKEN;

  event UpdateValues(address indexed feed);

  constructor(
    address _ohmFeed,
    address _indexFeed,
    address _baseFeed,
    address _baseToken
  ) {
    ohmFeed = AggregatorV3Interface(_ohmFeed);
    indexFeed = AggregatorV3Interface(_indexFeed);
    baseFeed = AggregatorV3Interface(_baseFeed);
    BASE_TOKEN = _baseToken;
  }

  function getSafePrice(address _token) public view returns (uint256) {
    return getCurrentPrice(_token);
  }

  function getCurrentPrice(address _token) public view returns (uint256) {
    (, int256 ohmUsd, , , ) = ohmFeed.latestRoundData();
    (, int256 index, , , ) = indexFeed.latestRoundData();
    (, int256 baseUsd, , , ) = baseFeed.latestRoundData();
    return (uint256(ohmUsd) * uint256(index) * 1e9) / uint256(baseUsd);
  }

  function updateSafePrice(address _feed) public returns (uint256) {
    emit UpdateValues(_feed); // keeps this mutable so it matches the interface
    return getCurrentPrice(_feed);
  }

  function VERSION() external view returns (uint256) {
    return 1;
  }
}
