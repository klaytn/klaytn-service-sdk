// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

// For the Witnet Request Board OVM-compatible (Optimism) "trustable" implementation (e.g. BOBA network),
// replace the next import line with:
// import "witnet-solidity-bridge/contracts/impls/trustable/WitnetRequestBoardTrustableBoba.sol";
import "witnet-solidity-bridge/contracts/impls/trustable/WitnetRequestBoardTrustableDefault.sol";
import "witnet-solidity-bridge/contracts/requests/WitnetRequestInitializableBase.sol";

// The bytecode of the postRequestExample query that will be sent to Witnet
contract postRequestExampleRequest is WitnetRequestInitializableBase {
  function initialize() public {
    WitnetRequestInitializableBase.initialize(hex"0a8a0112720803121868747470733a2f2f6874747062696e2e6f72672f706f73741a1d83187782186667686561646572738218676b4865616465722d4e616d6522185468697320697320746865207265717565737420626f64792a1b0a0b4865616465722d4e616d65120c4865616465722d56616c75651a090a050808120180100222090a05080812018010021080e497d012180a208094ebdc0328333080e8eda1ba01");
  }
}
