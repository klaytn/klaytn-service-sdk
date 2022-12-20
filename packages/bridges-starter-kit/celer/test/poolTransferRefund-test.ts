import { expect } from "chai"
import { poolTransferRefund } from "../use-cases"
import { ContractTransaction } from "ethers"
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
        CBRIDGE_GATEWAY_URL = 'https://cbridge-v2-test.celer.network'
        WALLET_ADDRESS="0x1Efd3eFd7c78d98B155F724EB6A161C50d8CFbf0"
        PRIVATE_KEY='ea04b975612cb9d108cc75bf13510d5a529006f6aed9056808681f8e74e03779'
        SRC_CHAIN_ID=5
        SRC_CHAIN_RPC='https://ethereum-goerli-rpc.allthatnode.com'
        TOKEN_SYMBOL='USDC'
        AMOUNT='5'
        SLIPPAGE_TOLERANCE=60000
        TRANSFER_ID='0xa4f23641a71d0fbc257feb8b61952f2b50e950acae96391bd7ac5f3ced17cbbc'
        CONFIRMATIONS=6

        expect(true)
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
