// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IYtoken {
    function deposit(uint _amount) external;
    function withdraw(uint _shares) external;
    function balanceOf(address account) external view returns (uint);
    function getPricePerFullShare() external view returns (uint);
}