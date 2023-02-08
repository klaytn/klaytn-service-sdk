import { expect } from "chai"
import { mintCanonicalToken } from "../use-cases"
describe("mintCanonicalToken", async () => {
    let CBRIDGE_GATEWAY_URL: string
    let WALLET_ADDRESS: string
    let PRIVATE_KEY: string
    let SRC_CHAIN_ID: number
    let DST_CHAIN_ID: number
    let SRC_CHAIN_RPC: string
    let TOKEN_SYMBOL: string
    let AMOUNT: string
    let CONFIRMATIONS: number

    it("should init the params", async () => {

        CBRIDGE_GATEWAY_URL = process.env.CBRIDGE_GATEWAY_URL as string
        WALLET_ADDRESS= process.env.WALLET_ADDRESS as string
        PRIVATE_KEY= process.env.PRIVATE_KEY as string
        SRC_CHAIN_ID= process.env.SRC_CHAIN_ID as unknown as number
        SRC_CHAIN_RPC= process.env.SRC_CHAIN_RPC as string
        TOKEN_SYMBOL= process.env.TOKEN_SYMBOL as string
        AMOUNT= process.env.AMOUNT as string
        CONFIRMATIONS= process.env.CONFIRMATIONS as unknown as number

        expect(CBRIDGE_GATEWAY_URL, 'CBRIDGE_GATEWAY_URL is required').to.not.be.empty;
        expect(WALLET_ADDRESS, 'WALLET_ADDRESS is required').to.not.be.empty
        expect(PRIVATE_KEY, 'PRIVATE_KEY is required').to.not.be.empty
        expect(SRC_CHAIN_ID, 'SRC_CHAIN_ID is required').to.not.be.NaN
        expect(SRC_CHAIN_RPC, 'SRC_CHAIN_RPC is required').to.not.be.empty
        expect(TOKEN_SYMBOL, 'TOKEN_SYMBOL is required').to.not.be.empty
        expect(AMOUNT, 'AMOUNT is required').to.not.be.empty
        expect(CONFIRMATIONS, 'CONFIRMATIONS is required').to.not.be.NaN
    })
    it("should perform mintCanonicalToken action", async () => {
         const depositId = await mintCanonicalToken(
            CBRIDGE_GATEWAY_URL,
            WALLET_ADDRESS,
            PRIVATE_KEY,
            SRC_CHAIN_ID,
            DST_CHAIN_ID,
            SRC_CHAIN_RPC,
            TOKEN_SYMBOL,
            AMOUNT,
            CONFIRMATIONS
        )

        expect(depositId).to.contains('0x', "invalid deposit id")
    })
})
