import { JSDOM } from "jsdom"
import {providers} from "ethers";
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest

import { config } from "dotenv"
config()

import { estimateAmt, getTransferConfigs, getTransferStatus, poolBasedTransfer } from "../APIs"
import {
    getAllowance,
    getTransferId,
    getTransferObject,
    checkApprove,
    approve,
    getBridgeContractAddress,
    getContract,
    getConfirmations
} from "../helper"
import BridgeABI from "../contract/abi/Bridge.sol/Bridge.json"
import { statusTracker } from "../APIs/StatusTracker"
import { GetTransferStatusResponse } from "../ts-proto/gateway/gateway_pb"

const rpc: string = process.env.CBRIDGE_GATEWAY_URL!
const walletAddress: string = process.env.WALLET_ADDRESS!

;(async () => {
    console.log("0. get transfer config for transaction");
    const transferConfigs = await getTransferConfigs(rpc);
    const srcChainId = parseInt(process.env.CHAIN1_ID!);
    const dstChainId = parseInt(process.env.CHAIN2_ID!);
    const tokenSymbol = process.env.TOKEN_SYMBOL!;
    const amount = process.env.AMOUNT!;
    const slippageTolerance = parseInt(process.env.SLIPPAGE_TOLERANCE!);

    const bridgeAddress = getBridgeContractAddress(transferConfigs, srcChainId)
    const bridgeContract = getContract(bridgeAddress || '', BridgeABI.abi, srcChainId)

    // check if tokensymbol is present in both chain tokens list
    let isPresentInSrc = !!(transferConfigs.chain_token[srcChainId]?.token?.filter(chainToken => chainToken?.token?.symbol.toUpperCase() == tokenSymbol.toUpperCase()).length > 0);
    let isPresentInDst = !!(transferConfigs.chain_token[dstChainId]?.token?.filter(chainToken => chainToken?.token?.symbol.toUpperCase() == tokenSymbol.toUpperCase()).length > 0);

    if(!(isPresentInSrc && isPresentInDst)) {
        throw new Error("Please choose valid pairs");
    }

    const { transferToken, value, toChain, nonce, fromChain } = getTransferObject(transferConfigs, srcChainId, dstChainId, tokenSymbol, amount)

    /**Check user's on-chain token allowance for cBridge contract.
     * If the allowance is not enough for user token transfer, trigger the corresponding on-chain approve flow */
    console.log("1. Checking Allowance of tokens to cBridge contract");
    const allowance = await getAllowance(walletAddress, bridgeAddress || '' , transferToken?.token?.address || '', fromChain?.id, transferToken?.token?.symbol, transferConfigs.pegged_pair_configs)
    let needToApprove = false;
    let isNative = transferConfigs.chains.filter(chain =>
        (chain.id == srcChainId && chain.gas_token_symbol.toUpperCase() == tokenSymbol.toUpperCase())).length > 0;
    needToApprove = checkApprove(allowance, amount, transferToken?.token, isNative)

    if (needToApprove) {
        console.log("Approving the tokens");
        const approveTx = await approve(bridgeAddress || '', transferToken?.token, amount, srcChainId)
        if (!approveTx) {
            console.log(`Cannot approve the token`)
            return
        } else {
            needToApprove = false
        }
        console.log("approveTx hash: " + approveTx.hash);
        console.log("Waiting for the confirmations of approveTx");
        const confirmationReceipt = await getConfirmations(approveTx.hash, 2); // instead of waiting for fixed time, wait for some confirmations
        console.log(`approveTx confirmed upto ${confirmationReceipt.confirmations} confirmations`);
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

    console.log("2. make an estimation for this transfer");
    const estimateRequest = estimateAmt(srcChainId, dstChainId, tokenSymbol, walletAddress, slippageTolerance, amount)

    console.log("3. submit an on-chain send transaction");
    let poolTransferTx = await poolBasedTransfer(bridgeContract, rpc, walletAddress, estimateRequest, { transferToken, fromChain, toChain, value, nonce }, srcChainId, isNative)

    if ( !poolTransferTx) return;
    console.log("approveTx hash: " + poolTransferTx.hash);
    console.log("Waiting for the confirmations of poolTransferTx");
    const confirmationReceipt = await getConfirmations(poolTransferTx.hash, 6); // instead of waiting for fixed time, wait for some confirmations
    console.log(`poolTransferTx confirmed upto ${confirmationReceipt.confirmations} confirmations`);

    console.log("4. getTransferStatus for this transaction until the transfer is complete or needs a refund");
    statusTracker(rpc, transferId)
})()
