// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface ISupraSValueFeed {
    function checkPrice(
        string memory marketPair
    ) external view returns (int256 price, uint256 timestamp);
}

contract SupraValueFeedExample {
    ISupraSValueFeed internal sValueFeed;

    constructor() {
        sValueFeed = ISupraSValueFeed(0x7f003178060af3904b8b70fEa066AEE28e85043E);
    }

    function getPrice(string memory marketPair) external view returns (int) {
        (int price /* uint timestamp */, ) = sValueFeed.checkPrice(marketPair);
        return price;
    }
}
