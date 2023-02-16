import { expect } from "chai"
import { burnCanonicalToken } from "../../use-cases"
import * as GetData from "../../core/APIs/GetData"

describe("burnCanonicalToken", () => {

    test("Burn Canonical Token", (done) => {

      const CBRIDGE_GATEWAY_URL = "https://cbridge-v2-test.celer.network"
      const SRC_CHAIN_RPC= "https://godwoken-testnet-v1.ckbapp.dev"
      const WALLET_ADDRESS = "0x5Bc0635a264B94A8662e0F2887d76F8E5925F837"
      const PRIVATE_KEY= "private key here"
      const SRC_CHAIN_ID= 71401
      const DST_CHAIN_ID= 5
      const TOKEN_SYMBOL= "USDC"
      const AMOUNT= "21" // Amount must be between min, max burn configuration and have enough balance. Please refer to the Note section above for more details.
      const CONFIRMATIONS= 6
      const expectedBurnId = "0x42f176213beff1ac6ebd94e0dcaa050adc1cc28b9ee6ba97e02082de9864698e"

      const statusData: any = { status : 5 }
      jest.spyOn(GetData, "getTransferStatus").mockResolvedValue(statusData)

      burnCanonicalToken(
              CBRIDGE_GATEWAY_URL,
              SRC_CHAIN_RPC,
              WALLET_ADDRESS,
              PRIVATE_KEY,
              SRC_CHAIN_ID,
              DST_CHAIN_ID,
              TOKEN_SYMBOL,
              AMOUNT,
              CONFIRMATIONS
      ).then(burnId => {
          console.log("BurnId =", burnId)
          expect(expectedBurnId).to.equal(burnId)
          setTimeout(() => {
            done()
          }, 2000)
      })
    });
});