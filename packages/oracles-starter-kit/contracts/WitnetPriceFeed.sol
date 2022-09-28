// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

import "witnet-solidity-bridge/contracts/interfaces/IWitnetPriceRouter.sol";

contract WitnetPriceFeed {
    IWitnetPriceRouter public immutable witnetPriceRouter;

    /*
     * Network: Klaytn Baobab
     * WitnetPriceRouter: 0xeD074DA2A76FD2Ca90C1508930b4FB4420e413B0
     **/
    constructor(IWitnetPriceRouter _router) {
        witnetPriceRouter = _router;
    }

    function getKlayUsdPrice() public view returns (int256 _lastPrice, uint256 _lastTimestamp) {
        (_lastPrice, _lastTimestamp,) = witnetPriceRouter.valueFor(bytes4(0x6cc828d1));
    }
}