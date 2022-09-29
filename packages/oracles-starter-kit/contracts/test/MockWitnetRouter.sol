//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract MockWitnetRouter {
    function valueFor(bytes32 _id) public view returns (int256,uint256,uint256) {
        return (10, 10, 10);
    }
}