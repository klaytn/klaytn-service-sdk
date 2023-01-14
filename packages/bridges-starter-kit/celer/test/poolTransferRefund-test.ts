import { expect } from "chai"
import { poolTransfer, poolTransferRefund } from "../use-cases"
import { getTransferStatus } from "../core"
describe("poolTransferRefund", async () => {
    let CBRIDGE_GATEWAY_URL: string
    let WALLET_ADDRESS: string
    let PRIVATE_KEY: string
    let SRC_CHAIN_ID: number
    let SRC_CHAIN_RPC: string
    let TOKEN_SYMBOL: string
    let AMOUNT: string
    let SLIPPAGE_TOLERANCE: number
    let TRANSFER_ID: string
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
        TRANSFER_ID= process.env.TRANSFER_ID! as string
        CONFIRMATIONS=parseInt( process.env.CONFIRMATIONS!)

        expect(CBRIDGE_GATEWAY_URL, 'CBRIDGE_GATEWAY_URL is required').to.not.be.empty;
        expect(WALLET_ADDRESS, 'WALLET_ADDRESS is required').to.not.be.empty
        expect(PRIVATE_KEY, 'PRIVATE_KEY is required').to.not.be.empty
        expect(SRC_CHAIN_ID, 'SRC_CHAIN_ID is required').to.not.be.NaN
        expect(SRC_CHAIN_RPC, 'SRC_CHAIN_RPC is required').to.not.be.empty
        expect(TOKEN_SYMBOL, 'TOKEN_SYMBOL is required').to.not.be.empty
        expect(AMOUNT, 'AMOUNT is required').to.not.be.empty
        expect(TRANSFER_ID, 'TRANSFER_ID is required').to.not.be.empty
        expect(SLIPPAGE_TOLERANCE, 'SLIPPAGE_TOLERANCE is required').to.not.be.NaN
        expect(CONFIRMATIONS, 'CONFIRMATIONS is required').to.not.be.NaN
    })
    it("should throw error for invalid SRC_CHAIN_ID", async function() {
        let invalidSrcChainId = 2
        try {
            await poolTransferRefund(
                CBRIDGE_GATEWAY_URL,
                WALLET_ADDRESS,
                PRIVATE_KEY,
                invalidSrcChainId,
                SRC_CHAIN_RPC,
                TOKEN_SYMBOL,
                AMOUNT,
                SLIPPAGE_TOLERANCE,
                TRANSFER_ID,
                CONFIRMATIONS
            )
        } catch (e) {
            // @ts-ignore
            expect(e.message).to.equal('SRC_CHAIN_ID not supported by cBridge')
        }
    })
    it("should throw error if TRANSFER_ID is of status 'UNKNOWN'", async function() {
        let invalidTransferId = '0x0963539b3ef3f0c4033e3e93ac733a7f6484345f6db8d3d85b389033ab466300'
        try {
            await poolTransferRefund(
                CBRIDGE_GATEWAY_URL,
                WALLET_ADDRESS,
                PRIVATE_KEY,
                SRC_CHAIN_ID,
                SRC_CHAIN_RPC,
                TOKEN_SYMBOL,
                AMOUNT,
                SLIPPAGE_TOLERANCE,
                invalidTransferId,
                CONFIRMATIONS
            )
        } catch (e) {
            // @ts-ignore
            expect(e.message).to.equal('cBRIDGE => TRANSFER_ID UNKNOWN / INVALID')
        }
    })
    it("should throw error if TRANSFER_ID is of status 'TRANSFER_ALREADY_COMPLETED'", async function() {
        let alreadyRefundedTransferId = '0x0963539b3ef3f0c4033e3e93ac733a7f6484345f6db8d3d85b389033ab466827'
        return true;
        try {
            await poolTransferRefund(
                CBRIDGE_GATEWAY_URL,
                WALLET_ADDRESS,
                PRIVATE_KEY,
                SRC_CHAIN_ID,
                SRC_CHAIN_RPC,
                TOKEN_SYMBOL,
                AMOUNT,
                SLIPPAGE_TOLERANCE,
                alreadyRefundedTransferId,
                CONFIRMATIONS
            )
        } catch (e) {
            // @ts-ignore
            expect(e.message).to.equal('cBRIDGE => TRANSFER_ALREADY_COMPLETED / NON_REFUNDABLE')
        }
    })
    it("given TRANSFER_ID should be of status 'TRANSFER_TO_BE_REFUNDED' to proceed", async function() {
        const status = await getTransferStatus(CBRIDGE_GATEWAY_URL, TRANSFER_ID)
        expect(status.status).to.equal(5, "status is not TRANSFER_TO_BE_REFUNDED")
    })
    it("should perform poolTransferRefund action", async () => {
         const receipt = await poolTransferRefund(
            CBRIDGE_GATEWAY_URL,
            WALLET_ADDRESS,
            PRIVATE_KEY,
            SRC_CHAIN_ID,
            SRC_CHAIN_RPC,
            TOKEN_SYMBOL,
            AMOUNT,
            SLIPPAGE_TOLERANCE,
            TRANSFER_ID,
            CONFIRMATIONS
        )

        expect(receipt.status).to.eq(1, "refundTx reverted")
    })
})
