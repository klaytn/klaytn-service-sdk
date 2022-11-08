import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest
import { config } from "dotenv"
config()

import { getTransferConfigs } from "../APIs"
import {
    approve,
    checkApprove,
    getAllowance,
    getBridgeVersion,
    getTransferObject,
    originalTokenVault,
    originalTokenVaultV2,
    transactor,
} from "../helper"

const rpc = process.env.CBRIDGE_GATEWAY_URL!
const walletAddress = process.env.WALLET_ADDRESS || ""

;(async () => {
    const transferConfigs = await getTransferConfigs(rpc)

    const srcChainId = 8217 //Klaytn
    const dstChainId = 56 //BNB Chain
    const tokenSymbol = "USDT"
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
                // eslint-disable-next-line
                originalTokenVaultV2!.deposit(
                    transferToken?.token?.address, //token address on original chain
                    value,
                    srcChainId, //Pegged chain id
                    walletAddress,
                    nonce
                )
            )
        } else {
            await transactor(
                // eslint-disable-next-line
                originalTokenVault!.deposit(
                    transferToken?.token?.address, //token address on original chain
                    value,
                    srcChainId, //Pegged chain id
                    walletAddress,
                    nonce
                )
            )
        }
    } catch (error: any) {
        console.log(`-Error:`, error)
    }
})()
