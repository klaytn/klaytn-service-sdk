import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest

import { config } from "dotenv"
config()

import { estimateAmt, getTransferConfigs, getTransferStatus, poolBasedTransfer } from "../APIs"
import { getTransferId, getTransferObject } from "../helper"

// transfer USDT from Klaytn to BNB
const rpc: string = process.env.CBRIDGE_GATEWAY_URL as string
const addr: string = process.env.WALLET_ADDRESS as string

(async () => {
    // 0. get transfer config for transaction
    const transferConfigs = await getTransferConfigs(rpc)
    const transferObject = getTransferObject(transferConfigs)
    const transferId = getTransferId(
        addr,
        transferObject.transferToken?.token?.address,
        transferObject.value,
        transferObject.toChain?.id,
        transferObject.nonce,
        transferObject.fromChain?.id
    )
    console.log("TransferId:", transferId)

    // 1. make an estimation for this transfer
    const estimateRequest = estimateAmt(8217, 56, "USDT", addr, 3000, "100000")

    // 2. submit an on-chain send transaction
    await poolBasedTransfer(rpc, addr, estimateRequest, transferObject)

    // 3. Poll getTransferStatus for this transaction until the transfer is complete or needs a refund
    await getTransferStatus(rpc, transferId)
})()
