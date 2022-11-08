import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest

import { config } from "dotenv"
config()

import { estimateAmt, getTransferConfigs, getTransferStatus, poolBasedTransfer } from "../APIs"
import { getAllowance, getTransferId, getTransferObject, checkApprove, approve, getBridgeContractAddress, getContract } from "../helper"
import BridgeABI from "../contract/abi/Bridge.sol/Bridge.json"

// transfer USDT from Klaytn to BNB
const rpc: string = process.env.CBRIDGE_GATEWAY_URL!
const walletAddress: string = process.env.WALLET_ADDRESS!

;(async () => {
    // 0. get transfer config for transaction
    const transferConfigs = await getTransferConfigs(rpc)
    const srcChainId = 8217 //Klaytn
    const dstChainId = 1 //Ethereum
    const tokenSymbol = "USDC"
    const amount = "10000"
    const bridgeAddress = getBridgeContractAddress(transferConfigs, srcChainId)
    const bridgeContract = getContract(bridgeAddress || '', BridgeABI.abi)

    const { transferToken, value, toChain, nonce, fromChain } = getTransferObject(transferConfigs, srcChainId, dstChainId, tokenSymbol, amount)

    /**Check user's on-chain token allowance for cBridge contract. 
     * If the allowance is not enough for user token transfer, trigger the corresponding on-chain approve flow */
    const allowance = await getAllowance(walletAddress, bridgeAddress || '' , transferToken?.token?.address || '', fromChain?.id, transferToken?.token?.symbol, transferConfigs.pegged_pair_configs)
    let needToApprove = false
    needToApprove = checkApprove(allowance, amount, transferToken?.token)

    if (needToApprove) {
        const approveTx = await approve(bridgeAddress || '', transferToken?.token)
        if (!approveTx) {
            console.log(`Cannot approve the token`)
            return
        } else {
            needToApprove = false
        }
    }

    const transferId = getTransferId(
        walletAddress,
        transferToken?.token?.address,
        value,
        toChain?.id,
        nonce,
        fromChain?.id
    )
    console.log("TransferId:", transferId)

    // 1. make an estimation for this transfer
    const estimateRequest = estimateAmt(8217, 56, "USDT", walletAddress, 3000, "100000")

    // 2. submit an on-chain send transaction
    await poolBasedTransfer(bridgeContract, rpc, walletAddress, estimateRequest, { transferToken, fromChain, toChain, value, nonce })

    // 3. Poll getTransferStatus for this transaction until the transfer is complete or needs a refund
    await getTransferStatus(rpc, transferId)
})()
