import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest

import { config } from "dotenv"
config()

import { estimateAmt, getTransferConfigs, getTransferStatus, poolBasedTransfer } from "../core"
import {
    getAllowance,
    getTransferId,
    getTransferObject,
    checkApprove,
    approve,
    getBridgeContractAddress,
    getContract
} from "../core"
import BridgeABI from "../core/contract/abi/Bridge.sol/Bridge.json"
import { statusTracker } from "../core"

export async function poolTransfer(
    CBRIDGE_GATEWAY_URL: string,
    WALLET_ADDRESS: string,
    PRIVATE_KEY: string,
    SRC_CHAIN_ID: number,
    DST_CHAIN_ID: number,
    SRC_CHAIN_RPC: string,
    TOKEN_SYMBOL: string,
    AMOUNT: string,
    SLIPPAGE_TOLERANCE: number,
    CONFIRMATIONS: number
): Promise<string> {
    console.log("0. get transfer config for transaction");
    const transferConfigs = await getTransferConfigs(CBRIDGE_GATEWAY_URL);

    const bridgeAddress = getBridgeContractAddress(transferConfigs, SRC_CHAIN_ID)
    if (!bridgeAddress) throw new Error('SRC_CHAIN_ID not yet supported by cBridge');

    const bridgeContract = getContract(bridgeAddress || '', BridgeABI.abi, SRC_CHAIN_RPC, PRIVATE_KEY)

    // check if TOKEN_SYMBOL is present in both chain tokens list
    const isPresentInSrc = !!(transferConfigs.chain_token[SRC_CHAIN_ID]?.token?.filter(chainToken => chainToken?.token?.symbol.toUpperCase() == TOKEN_SYMBOL.toUpperCase()).length > 0);
    const isPresentInDst = !!(transferConfigs.chain_token[DST_CHAIN_ID]?.token?.filter(chainToken => chainToken?.token?.symbol.toUpperCase() == TOKEN_SYMBOL.toUpperCase()).length > 0);

    if(!(isPresentInSrc && isPresentInDst)) {
        throw new Error("Please choose valid TOKEN_SYMBOL that is supported by given pair of chains");
    }

    const { transferToken, value, toChain, nonce, fromChain } = getTransferObject(transferConfigs, SRC_CHAIN_ID, DST_CHAIN_ID, TOKEN_SYMBOL, AMOUNT)

    /**Check user's on-chain token allowance for cBridge contract.
     * If the allowance is not enough for user token transfer, trigger the corresponding on-chain approve flow */
    console.log("1. Checking Allowance of tokens to cBridge contract");
    const allowance = await getAllowance(WALLET_ADDRESS, bridgeAddress || '' , transferToken?.token?.address || '', fromChain?.id, transferToken?.token?.symbol, SRC_CHAIN_RPC, transferConfigs.pegged_pair_configs)
    let needToApprove = false;
    const isNative = transferConfigs.chains.filter(chain =>
        (chain.id == SRC_CHAIN_ID && chain.gas_token_symbol.toUpperCase() == TOKEN_SYMBOL.toUpperCase())).length > 0;
    needToApprove = checkApprove(allowance, AMOUNT, transferToken?.token, isNative)

    if (needToApprove) {
        console.log("Approving the tokens");
        const approveTx = await approve(bridgeAddress || '', SRC_CHAIN_RPC, PRIVATE_KEY, transferToken?.token, AMOUNT)
        if (!approveTx) {
            throw new Error(`Cannot approve the token`)
        } else {
            needToApprove = false
        }
        console.log("approveTx hash: " + approveTx.hash);
        console.log("Waiting for the confirmations of approveTx");
        const confirmationReceipt = await approveTx.wait(CONFIRMATIONS); // instead of waiting for fixed time, wait for some confirmations
        console.log(`approveTx confirmed upto ${confirmationReceipt.confirmations} confirmations`);
    }

    const transferId = getTransferId(
        WALLET_ADDRESS,
        transferToken?.token?.address,
        value,
        toChain?.id,
        nonce,
        fromChain?.id
    )
    console.log("TransferId:", transferId)

    console.log("2. make an estimation for this transfer");
    const estimateRequest = estimateAmt(SRC_CHAIN_ID, DST_CHAIN_ID, TOKEN_SYMBOL, WALLET_ADDRESS, SLIPPAGE_TOLERANCE, AMOUNT)

    console.log("3. submit an on-chain send transaction");
    const poolTransferTx = await poolBasedTransfer(bridgeContract, CBRIDGE_GATEWAY_URL, WALLET_ADDRESS, estimateRequest, { transferToken, fromChain, toChain, value, nonce }, SRC_CHAIN_RPC, PRIVATE_KEY, isNative)

    if ( !poolTransferTx) throw new Error("Cannot submit transaction");
    console.log("poolTransferTx hash: " + poolTransferTx.hash);
    console.log("Waiting for the confirmations of poolTransferTx");
    const confirmationReceipt = await poolTransferTx.wait(CONFIRMATIONS); // instead of waiting for fixed time, wait for some confirmations
    console.log(`poolTransferTx confirmed upto ${confirmationReceipt.confirmations} confirmations`);

    console.log("4. getTransferStatus for this transaction until the transfer is complete or needs a refund");
    statusTracker(CBRIDGE_GATEWAY_URL, transferId)
    return transferId;
}
