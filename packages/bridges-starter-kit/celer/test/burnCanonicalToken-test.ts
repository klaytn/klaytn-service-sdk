import { expect } from "chai"
import { burnCanonicalToken } from "../use-cases"
describe("burnCanonicalToken", async () => {
    let CBRIDGE_GATEWAY_URL: string
    let WALLET_ADDRESS: string
    let PRIVATE_KEY: string
    let SRC_CHAIN_ID: number
    let DST_CHAIN_ID: number
    let SRC_CHAIN_RPC: string
    let TOKEN_SYMBOL: string
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
        AMOUNT='5'
        CONFIRMATIONS=2

        expect(true)
    })
    it("should perform mintCanonicalToken action", async () => {
         const depositId = await burnCanonicalToken(
            CBRIDGE_GATEWAY_URL,
            SRC_CHAIN_RPC,
            WALLET_ADDRESS,
            PRIVATE_KEY,
            SRC_CHAIN_ID,
            DST_CHAIN_ID,
            TOKEN_SYMBOL,
            AMOUNT,
            CONFIRMATIONS
        )

        expect(depositId).to.contains('0x', "invalid deposit id")
    })
})
