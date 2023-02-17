import { expect } from "chai"
import { poolTransfer } from "../../use-cases"
import * as GetData from "../../core/APIs/GetData"

describe("poolTransfer", () => {

    test("Pool Transfer", (done) => {

      const CBRIDGE_GATEWAY_URL = "https://cbridge-v2-test.celer.network"
      const WALLET_ADDRESS = "0x5Bc0635a264B94A8662e0F2887d76F8E5925F837"
      const PRIVATE_KEY= "private key here" // Account should contain enough USDC tokens. Get Test USDC from https://test-cbridge-v2.celer.network/5/80001/USDC.
      const SRC_CHAIN_ID= 5
      const DST_CHAIN_ID= 80001
      const SRC_CHAIN_RPC= "https://ethereum-goerli-rpc.allthatnode.com"
      const TOKEN_SYMBOL= "USDC"
      const AMOUNT= "1"
      const SLIPPAGE_TOLERANCE= 550000 // 
      const CONFIRMATIONS= 6
      const expectedTransferId = "0xcfb407a74a3cf621777a8948ce1e26ee4e6dd5766a3ab26041f599e8ab40184b";

      const statusData: any = { status : 5 }
      jest.spyOn(GetData, "getTransferStatus").mockResolvedValue(statusData)
      
      // Can also view the transaction in the Celer UI (https://test-cbridge-v2.celer.network/5/80001/USDC)
      poolTransfer(
              CBRIDGE_GATEWAY_URL,
              WALLET_ADDRESS,
              PRIVATE_KEY,
              SRC_CHAIN_ID,
              DST_CHAIN_ID,
              SRC_CHAIN_RPC,
              TOKEN_SYMBOL,
              AMOUNT,
              SLIPPAGE_TOLERANCE,
              CONFIRMATIONS
      ).then(transferId => {
        console.log("TransferId =", transferId)
        expect(expectedTransferId).to.equal(transferId)
        setTimeout(() => {
          done()
        }, 2000)
      })
      
    });
});