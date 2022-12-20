import { expect } from "chai"
import { mintCanonicalTokenRefund } from "../use-cases"
describe("mintCanonicalTokenRefund", async () => {
    let CBRIDGE_GATEWAY_URL: string
    let WALLET_ADDRESS: string
    let PRIVATE_KEY: string
    let SRC_CHAIN_ID: number
    let DST_CHAIN_ID: number
    let SRC_CHAIN_RPC: string
    let SLIPPAGE_TOLERANCE: number
    let TOKEN_SYMBOL: string
    let DEPOSIT_ID: string
    let AMOUNT: string
    let CONFIRMATIONS: number

    it("should init the params", async () => {
        CBRIDGE_GATEWAY_URL = 'https://cbridge-v2-test.celer.network'
        WALLET_ADDRESS="0x1Efd3eFd7c78d98B155F724EB6A161C50d8CFbf0"
        PRIVATE_KEY='ea04b975612cb9d108cc75bf13510d5a529006f6aed9056808681f8e74e03779'
        SRC_CHAIN_ID=5
        DST_CHAIN_ID=71401
        SRC_CHAIN_RPC='https://ethereum-goerli-rpc.allthatnode.com'
        SLIPPAGE_TOLERANCE=6000
        DEPOSIT_ID='0x4318eafd09573c27ef5335c97eb408775d39c5fca2eaae37615f980b4d10714b'
        TOKEN_SYMBOL='USDC'
        AMOUNT='5'
        CONFIRMATIONS=2

        expect(true)
    })
    it("should perform mintCanonicalTokenRefund action", async () => {
         const receipt = await mintCanonicalTokenRefund(
            CBRIDGE_GATEWAY_URL,
            WALLET_ADDRESS,
            PRIVATE_KEY,
            SRC_CHAIN_ID,
            DST_CHAIN_ID,
            SRC_CHAIN_RPC,
            SLIPPAGE_TOLERANCE,
            TOKEN_SYMBOL,
            DEPOSIT_ID,
            AMOUNT,
            CONFIRMATIONS
        )

        expect(receipt.status).to.eq(1, "refundTx reverted")
    })
})
