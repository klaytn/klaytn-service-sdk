import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest
import { config } from "dotenv"
config()

import {
    getTransferObject,
    getPegConfig,
    transactor,
    getAllowance,
    checkApprove,
    approve,
    getContract, getConfirmations
} from "../helper"
import { getTransferConfigs } from "../APIs"
import { ethers, providers, Wallet } from "ethers"
import PeggedTokenBridgeABI from '../contract/abi/pegged/PeggedTokenBridge.sol/PeggedTokenBridge.json';
import PeggedTokenBridgeV2ABI from '../contract/abi/pegged/PeggedTokenBridgeV2.sol/PeggedTokenBridgeV2.json';
import { statusTracker } from "../APIs/StatusTracker"

const rpc = process.env.CBRIDGE_GATEWAY_URL!
const walletAddress = process.env.WALLET_ADDRESS || ""


;(async () => {
    console.log("0. get transfer config for transaction");
    const transferConfigs = await getTransferConfigs(rpc)

    const srcChainId = parseInt(process.env.CHAIN2_ID!);
    const srcChainRPC: string = process.env.CHAIN2_RPC!;
    const dstChainId = parseInt(process.env.CHAIN1_ID!);
    const tokenSymbol =  process.env.TOKEN_SYMBOL!;
    const amount = process.env.AMOUNT!;
    const confirmations: number = parseInt(process.env.CONFIRMATIONS ? process.env.CONFIRMATIONS : "6");

    // check if its a valid pair transfer
    let isPairPresent = !!(transferConfigs.pegged_pair_configs.filter(chainToken =>
                        (chainToken.org_chain_id == dstChainId
                            && chainToken.pegged_chain_id == srcChainId
                            && chainToken.pegged_token?.token?.symbol.toUpperCase() == tokenSymbol
                        )).length > 0);

    if(!isPairPresent) {
        throw new Error("Please choose valid pairs");
    }

    const peggedTokenBridgeAddress = transferConfigs.pegged_pair_configs.find(config => config.pegged_chain_id === srcChainId && config.bridge_version < 2)?.pegged_burn_contract_addr
    const peggedTokenBridge = getContract(peggedTokenBridgeAddress || '', PeggedTokenBridgeABI.abi, srcChainId)
    const peggedTokenBridgeV2Address = transferConfigs.pegged_pair_configs.find(config => config.pegged_chain_id === srcChainId && config.bridge_version === 2)?.pegged_burn_contract_addr
    const peggedTokenBridgeV2 = getContract(peggedTokenBridgeV2Address || '', PeggedTokenBridgeV2ABI.abi, srcChainId)

    const { transferToken, value, nonce } = getTransferObject(
        transferConfigs,
        srcChainId,
        dstChainId,
        tokenSymbol,
        amount
    )

    const pegConfig = getPegConfig(transferConfigs, srcChainId, dstChainId, tokenSymbol)
    const bridgeVersion = pegConfig?.bridge_version

    const spenderAddress = bridgeVersion === 2 ? peggedTokenBridgeV2Address : peggedTokenBridgeAddress
    /**Check user's on-chain token allowance for peggedtoken contract.
     * If the allowance is not enough for user token transfer, trigger the corresponding on-chain approve flow */
    console.log("1. Checking Allowance of tokens to PeggedToken contract");
    const allowance = await getAllowance(
        walletAddress,
        spenderAddress || "",
        transferToken?.token?.address || "",
        srcChainId,
        transferToken?.token?.symbol,
        transferConfigs.pegged_pair_configs
    )
    let needToApprove = false;
    let isNative = transferConfigs.chains.filter(chain =>
        (chain.id == srcChainId && chain.gas_token_symbol.toUpperCase() == tokenSymbol.toUpperCase())).length > 0;
    needToApprove = checkApprove(allowance, amount, transferToken?.token, isNative)

    if (needToApprove) {
        console.log("Approving the tokens");
        const approveTx = await approve(
            spenderAddress || "",
            transferToken?.token,
            amount,
            srcChainId
        )
        if (!approveTx) {
            console.log(`Cannot approve the token`)
            return
        } else {
            needToApprove = false
        }
        console.log("approveTx hash: " + approveTx.hash);
        console.log("Waiting for the confirmations of approveTx");
        const confirmationReceipt = await getConfirmations(approveTx.hash, confirmations, srcChainRPC); // instead of waiting for fixed time, wait for some confirmations
        console.log(`approveTx confirmed upto ${confirmationReceipt.confirmations} confirmations`);
    }

    try {
        if (bridgeVersion === 2) {
            const burnId = ethers.utils.solidityKeccak256(
                [
                    "address",
                    "address",
                    "uint256",
                    "uint64",
                    "address",
                    "uint64",
                    "uint64",
                    "address",
                ],
                [
                    walletAddress,
                    transferToken?.token?.address,
                    value?.toString(),
                    dstChainId.toString(),
                    walletAddress,
                    nonce?.toString(),
                    pegConfig?.pegged_chain_id.toString(),
                    peggedTokenBridgeV2.address,
                ]
            )
            console.log("burnId:", burnId)
            console.log("3. submit an on-chain send transaction");
            let burnTx =  await transactor(
                    peggedTokenBridgeV2!.burn(
                        transferToken?.token?.address,
                        value,
                        dstChainId,
                        walletAddress,
                        nonce,
                        {gasLimit: 200000 }
                    ),
                    srcChainId
                )
            // TODO: should if tx was passed or failed (logically)
            console.log("burnTx hash: " + burnTx.hash);
            console.log("Waiting for the confirmations of burnTx");
            const confirmationReceipt = await getConfirmations(burnTx.hash, confirmations, srcChainRPC); // instead of waiting for fixed time, wait for some confirmations
            console.log(`burnTx confirmed upto ${confirmationReceipt.confirmations} confirmations`);
            console.log("4. getTransferStatus for this transaction until the transfer is complete or needs a refund");
            statusTracker(rpc, burnId)
        } else {
            const burnId = ethers.utils.solidityKeccak256(
                ["address", "address", "uint256", "address", "uint64", "uint64"],
                [
                    walletAddress,
                    transferToken?.token?.address,
                    value?.toString(),
                    walletAddress,
                    nonce?.toString(),
                    pegConfig?.pegged_chain_id.toString(),
                ]
            )
            console.log("burnId:", burnId)
            console.log("3. submit an on-chain send transaction");
            let burnTx = await transactor(
                            peggedTokenBridge!.burn(transferToken?.token?.address,
                                value,
                                walletAddress,
                                nonce,
                                {gasLimit: 200000 }),
                            srcChainId
                        );
            console.log("burnTx hash: " + burnTx.hash);
            console.log("Waiting for the confirmations of burnTx");
            const confirmationReceipt = await getConfirmations(burnTx.hash, confirmations, srcChainRPC); // instead of waiting for fixed time, wait for some confirmations
            console.log(`burnTx confirmed upto ${confirmationReceipt.confirmations} confirmations`);
            console.log("4. getTransferStatus for this transaction until the transfer is complete or needs a refund");
            statusTracker(rpc, burnId)
        }
    } catch (error: any) {
        console.log(`-Error:`, error)
    }
})()
