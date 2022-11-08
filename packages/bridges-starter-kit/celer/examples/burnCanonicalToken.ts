import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest
import { config } from "dotenv"
config()

import {
    getTransferObject,
    getBridgeVersion,
    peggedTokenBridge,
    peggedTokenBridgeV2,
    transactor,
    getAllowance,
    checkApprove,
    approve,
} from "../helper"
import { getTransferConfigs } from "../APIs"

const rpc = process.env.CBRIDGE_GATEWAY_URL!
const walletAddress = process.env.WALLET_ADDRESS || ""

;(async () => {
    const transferConfigs = await getTransferConfigs(rpc)

    const srcChainId = 8217 //Klaytn
    const dstChainId = 1 //Ethereum
    const tokenSymbol = "USDC"
    const amount = "10000"

    const { transferToken, value, nonce } = getTransferObject(
        transferConfigs,
        srcChainId,
        dstChainId,
        tokenSymbol,
        amount
    )
    const bridgeVersion = getBridgeVersion(transferConfigs, srcChainId, dstChainId, tokenSymbol)

    /**Check user's on-chain token allowance for cBridge contract.
     * If the allowance is not enough for user token transfer, trigger the corresponding on-chain approve flow */
    const allowance = await getAllowance(
        walletAddress,
        process.env.KLAYTN_BRIDGE_CONTRACT || "",
        transferToken?.token?.address || "",
        srcChainId,
        transferToken?.token?.symbol,
        transferConfigs.pegged_pair_configs
    )
    let needToApprove = false
    needToApprove = checkApprove(allowance, amount, transferToken?.token)

    if (needToApprove) {
        const approveTx = await approve(
            process.env.KLAYTN_BRIDGE_CONTRACT || "",
            transferToken?.token
        )
        if (!approveTx) {
            console.log(`Cannot approve the token`)
            return
        } else {
            needToApprove = false
        }
    }

    try {
        if (bridgeVersion === 2) {
            await transactor(
                peggedTokenBridge!.burn(transferToken?.token?.address, value, walletAddress, nonce)
            )
        } else {
            await transactor(
                peggedTokenBridgeV2!.burn(
                    transferToken?.token?.address,
                    value,
                    dstChainId,
                    walletAddress,
                    nonce
                )
            )
        }
    } catch (error: any) {
        console.log(`-Error:`, error)
    }
})()
