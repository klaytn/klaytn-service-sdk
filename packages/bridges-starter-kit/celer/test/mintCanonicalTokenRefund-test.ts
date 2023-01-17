import { expect } from "chai"
import { mintCanonicalTokenRefund } from "../use-cases"
import { getTransferStatus } from "../core"
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

        CBRIDGE_GATEWAY_URL = process.env.CBRIDGE_GATEWAY_URL! as string
        WALLET_ADDRESS= process.env.WALLET_ADDRESS! as string
        PRIVATE_KEY= process.env.PRIVATE_KEY! as string
        SRC_CHAIN_ID= parseInt(process.env.SRC_CHAIN_ID!)
        SRC_CHAIN_RPC= process.env.SRC_CHAIN_RPC! as string
        TOKEN_SYMBOL= process.env.TOKEN_SYMBOL! as string
        AMOUNT= process.env.AMOUNT! as string
        SLIPPAGE_TOLERANCE= parseInt(process.env.SLIPPAGE_TOLERANCE!)
        DEPOSIT_ID= process.env.DEPOSIT_ID! as string
        CONFIRMATIONS= parseInt(process.env.CONFIRMATIONS!)

        expect(CBRIDGE_GATEWAY_URL, 'CBRIDGE_GATEWAY_URL is required').to.not.be.empty;
        expect(WALLET_ADDRESS, 'WALLET_ADDRESS is required').to.not.be.empty
        expect(PRIVATE_KEY, 'PRIVATE_KEY is required').to.not.be.empty
        expect(SRC_CHAIN_ID, 'SRC_CHAIN_ID is required').to.not.be.NaN
        expect(SRC_CHAIN_RPC, 'SRC_CHAIN_RPC is required').to.not.be.empty
        expect(TOKEN_SYMBOL, 'TOKEN_SYMBOL is required').to.not.be.empty
        expect(AMOUNT, 'AMOUNT is required').to.not.be.empty
        expect(DEPOSIT_ID, 'DEPOSIT_ID is required').to.not.be.empty
        expect(CONFIRMATIONS, 'CONFIRMATIONS is required').to.not.be.NaN
        expect(SLIPPAGE_TOLERANCE, 'SLIPPAGE_TOLERANCE is required').to.not.be.NaN
    })
    it("should throw error for invalid SRC_CHAIN_ID", async function() {
        let invalidSrcChainId = 2
        try {
            await mintCanonicalTokenRefund(
                CBRIDGE_GATEWAY_URL,
                WALLET_ADDRESS,
                PRIVATE_KEY,
                invalidSrcChainId,
                DST_CHAIN_ID,
                SRC_CHAIN_RPC,
                SLIPPAGE_TOLERANCE,
                TOKEN_SYMBOL,
                DEPOSIT_ID,
                AMOUNT,
                CONFIRMATIONS
            )
        } catch (e) {
            // @ts-ignore
            expect(e.message).to.equal('SRC_CHAIN_ID not supported by cBridge')
        }
    })
    it("should throw error if DEPOSIT_ID is of status 'UNKNOWN'", async function() {
        let invalidDepositId = '0x0963539b3ef3f0c4033e3e93ac733a7f6484345f6db8d3d85b389033ab466300'
        try {
            await mintCanonicalTokenRefund(
                CBRIDGE_GATEWAY_URL,
                WALLET_ADDRESS,
                PRIVATE_KEY,
                SRC_CHAIN_ID,
                DST_CHAIN_ID,
                SRC_CHAIN_RPC,
                SLIPPAGE_TOLERANCE,
                TOKEN_SYMBOL,
                invalidDepositId,
                AMOUNT,
                CONFIRMATIONS
            )
        } catch (e) {
            // @ts-ignore
            expect(e.message).to.equal('cBRIDGE => TRANSFER_ID UNKNOWN / INVALID')
        }
    })
    it("should throw error if DEPOSIT_ID is of status 'TRANSFER_ALREADY_COMPLETED'", async function() {
        let alreadyRefundedDepositId = '0x0963539b3ef3f0c4033e3e93ac733a7f6484345f6db8d3d85b389033ab466827'
        try {
            await mintCanonicalTokenRefund(
                CBRIDGE_GATEWAY_URL,
                WALLET_ADDRESS,
                PRIVATE_KEY,
                SRC_CHAIN_ID,
                DST_CHAIN_ID,
                SRC_CHAIN_RPC,
                SLIPPAGE_TOLERANCE,
                TOKEN_SYMBOL,
                alreadyRefundedDepositId,
                AMOUNT,
                CONFIRMATIONS
            )
        } catch (e) {
            // @ts-ignore
            expect(e.message).to.equal('cBRIDGE => TRANSFER_ALREADY_COMPLETED / NON_REFUNDABLE')
        }
    })
    it("given DEPOSIT_ID should be of status 'TRANSFER_TO_BE_REFUNDED' to proceed", async function() {
        const status = await getTransferStatus(CBRIDGE_GATEWAY_URL, DEPOSIT_ID)
        expect(status.status).to.equal(5, "status is not TRANSFER_TO_BE_REFUNDED")
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
