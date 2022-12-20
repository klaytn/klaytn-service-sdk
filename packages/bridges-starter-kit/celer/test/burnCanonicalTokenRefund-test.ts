import { expect } from "chai"
import { burnCanonicalToken, burnCanonicalTokenRefund } from "../use-cases"
describe("burnCanonicalTokenRefund", async () => {
    let CBRIDGE_GATEWAY_URL: string
    let WALLET_ADDRESS: string
    let PRIVATE_KEY: string
    let SRC_CHAIN_ID: number
    let DST_CHAIN_ID: number
    let SRC_CHAIN_RPC: string
    let SLIPPAGE_TOLERANCE: number
    let TOKEN_SYMBOL: string
    let BURN_ID: string
    let AMOUNT: string
    let CONFIRMATIONS: number

    let transferId;

    it("should init the params", async () => {
        CBRIDGE_GATEWAY_URL = 'https://cbridge-v2-test.celer.network'
        WALLET_ADDRESS="0xPUBLIC_KEY_HERE"
        PRIVATE_KEY='PRIVATE_KEY_HERE'
        SRC_CHAIN_ID=71401
        DST_CHAIN_ID=5
        SRC_CHAIN_RPC='https://godwoken-testnet-v1.ckbapp.dev'
        TOKEN_SYMBOL='USDC'
        BURN_ID='0x8e841e44d95a44cd0605b16b269198e4941604d2ec53322fb323f0da9fc471c6'
        AMOUNT='5'
        CONFIRMATIONS=2

        expect(true)
    })
    it("should perform mintCanonicalTokenRefund action", async () => {
         const receipt = await burnCanonicalTokenRefund(
            CBRIDGE_GATEWAY_URL,
            WALLET_ADDRESS,
            SRC_CHAIN_ID,
            DST_CHAIN_ID,
            SRC_CHAIN_RPC,
            PRIVATE_KEY,
            SLIPPAGE_TOLERANCE,
            TOKEN_SYMBOL,
            BURN_ID,
            AMOUNT,
            CONFIRMATIONS
        )

        expect(receipt.status).to.eq(1, "refundTx reverted")
    })
})
