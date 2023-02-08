// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

// For the Witnet Request Board OVM-compatible (Optimism) "trustable" implementation (e.g. BOBA network),
// replace the next import line with:
// import "witnet-solidity-bridge/contracts/impls/trustable/WitnetRequestBoardTrustableBoba.sol";
import "witnet-solidity-bridge/contracts/impls/trustable/WitnetRequestBoardTrustableDefault.sol";
import "witnet-solidity-bridge/contracts/requests/WitnetRequestInitializableBase.sol";

// The bytecode of the klayPrice query that will be sent to Witnet
contract coinPriceRequest is WitnetRequestInitializableBase {
  function initialize() public {
    WitnetRequestInitializableBase.initialize(hex"0adf01125a0801124068747470733a2f2f6d696e2d6170692e63727970746f636f6d706172652e636f6d2f646174612f70726963653f6673796d3d4b4c4159267473796d733d5553441a14841877821864635553448218571a000f4240185b12630801123868747470733a2f2f6170692e636f696e626173652e636f6d2f76322f65786368616e67652d72617465733f63757272656e63793d4b4c41591a258618778218666464617461821866657261746573821864635553448218571a000f4240185b1a0d0a0908051205fa3fc000001003220d0a0908051205fa4020000010031080e497d012180a208094ebdc0328333080e8eda1ba01");
  }
}
