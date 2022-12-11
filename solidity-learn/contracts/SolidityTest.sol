//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract SolidityTest {
   constructor() payable {}
   function getOutput() external pure returns (uint value) {
      value = 1;
   }
}
