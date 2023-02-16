import { expect } from "chai"
import { mintCanonicalToken } from "../../use-cases"
import * as GetData from "../../core/APIs/GetData"

describe("mintCanonicalToken", () => {

    test("Mint Canonical Token Transfer", (done) => {
        
        const CBRIDGE_GATEWAY_URL = "https://cbridge-v2-test.celer.network"
        const WALLET_ADDRESS = "0x5Bc0635a264B94A8662e0F2887d76F8E5925F837"
        const PRIVATE_KEY= "private key here"
        const SRC_CHAIN_ID= 5
        const DST_CHAIN_ID= 71401
        const SRC_CHAIN_RPC= "https://ethereum-goerli-rpc.allthatnode.com"
        const TOKEN_SYMBOL= "USDC"
        const AMOUNT= "1"
        const CONFIRMATIONS= 6
        const expectedDepositId = "0xff1a7d4b1153cdf97259070bd2e81515b1b6ed12f38aeb8b44cbebbf96389fc1"

        const statusData: any = { status : 5 }
        jest.spyOn(GetData, "getTransferStatus").mockResolvedValue(statusData)

        mintCanonicalToken(
                CBRIDGE_GATEWAY_URL,
                WALLET_ADDRESS,
                PRIVATE_KEY,
                SRC_CHAIN_ID,
                DST_CHAIN_ID,
                SRC_CHAIN_RPC,
                TOKEN_SYMBOL,
                AMOUNT,
                CONFIRMATIONS
        ).then(depositId => {
            console.log("DepositId =", depositId)
            expect(expectedDepositId).to.equal(depositId)
            setTimeout(() => {
                done()
            }, 2000)
        });
    });
});

