import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest
import { config } from "dotenv"
config()

import { getTransferConfigs } from "../APIs"
import {
    approve,
    checkApprove,
    getAllowance, getConfirmations,
    getContract,
    getPegConfig,
    getTransferObject,
    transactor
} from "../helper"
import OriginalTokenVaultABI from '../contract/abi/pegged/OriginalTokenVault.sol/OriginalTokenVault.json'
import OriginalTokenVaultV2ABI from '../contract/abi/pegged/OriginalTokenVaultV2.sol/OriginalTokenVaultV2.json';
import { ethers } from "ethers"
import { statusTracker } from "../APIs/StatusTracker"

const rpc = process.env.CBRIDGE_GATEWAY_URL!
const walletAddress = process.env.WALLET_ADDRESS || ""

;(async () => {
    console.log("0. get transfer config for transaction");
    const transferConfigs = await getTransferConfigs(rpc)

    const srcChainId = parseInt(process.env.CHAIN1_ID!);
    const dstChainId = parseInt(process.env.CHAIN2_ID!);
    const tokenSymbol =  process.env.TOKEN_SYMBOL!;
    const amount = process.env.AMOUNT!;
    const confirmations: number = parseInt(process.env.CONFIRMATIONS ? process.env.CONFIRMATIONS : "6");

    // check if its a valid pair transfer
    let isPairPresent = !!(transferConfigs.pegged_pair_configs.filter(chainToken =>
        (chainToken.org_chain_id == srcChainId
            && chainToken.pegged_chain_id == dstChainId
            && chainToken.pegged_token?.token?.symbol.toUpperCase() == tokenSymbol
        )).length > 0);

    if(!isPairPresent) {
        throw new Error("Please choose valid pairs");
    }

    const originalTokenVaultAddress = transferConfigs.pegged_pair_configs.find(config => config.org_chain_id === srcChainId && config.vault_version < 2)?.pegged_deposit_contract_addr
    const originalTokenVault = getContract(originalTokenVaultAddress || '', OriginalTokenVaultABI.abi, srcChainId)
    const originalTokenVaultV2Address = transferConfigs.pegged_pair_configs.find(config => config.org_chain_id === srcChainId && config.vault_version === 2)?.pegged_deposit_contract_addr
    const originalTokenVaultV2 = getContract(originalTokenVaultV2Address || '', OriginalTokenVaultV2ABI.abi, srcChainId)

    const { transferToken, value, nonce } = getTransferObject(
        transferConfigs,
        srcChainId,
        dstChainId,
        tokenSymbol,
        amount
    )

    const pegConfig = getPegConfig(transferConfigs, srcChainId, dstChainId, tokenSymbol)
    const vaultVersion = pegConfig?.vault_version
    const spenderAddress = vaultVersion === 2 ? originalTokenVaultV2Address : originalTokenVaultAddress

    /**Check user's on-chain token allowance for Originaltoken contract.
     * If the allowance is not enough for user token transfer, trigger the corresponding on-chain approve flow */
    console.log("1. Checking Allowance of tokens to OriginalToken contract");
    const allowance = await getAllowance(
        walletAddress,
        spenderAddress || '',
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
        const confirmationReceipt = await getConfirmations(approveTx.hash, confirmations); // instead of waiting for fixed time, wait for some confirmations
        console.log(`approveTx confirmed upto ${confirmationReceipt.confirmations} confirmations`);
    }

    try {
        if (vaultVersion === 2) {
            const depositId = ethers.utils.solidityKeccak256(
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
                    pegConfig?.pegged_chain_id.toString(),
                    walletAddress,
                    nonce?.toString(),
                    pegConfig?.org_chain_id.toString(),
                    originalTokenVaultV2.address,
                ]
            )
            console.log("depositId:", depositId)
            console.log("3. submit an on-chain deposit transaction");
            const depositTx = await transactor(
                originalTokenVaultV2!.deposit(
                    transferToken?.token?.address, //token address on original chain
                    value,
                    pegConfig?.pegged_chain_id,
                    walletAddress,
                    nonce,
                    {gasLimit: 100000 }
                ),
                srcChainId
            )

            console.log("depositTx hash: " + depositTx.hash);
            console.log("Waiting for the confirmations of depositTx");
            const confirmationReceipt = await getConfirmations(depositTx.hash, confirmations); // instead of waiting for fixed time, wait for some confirmations
            console.log(`depositTx confirmed upto ${confirmationReceipt.confirmations} confirmations`);
            console.log("4. getTransferStatus for this transaction until the transfer is complete or needs a refund");
            statusTracker(rpc, depositId);
        } else {
            const depositId = ethers.utils.solidityKeccak256(
                ["address", "address", "uint256", "uint64", "address", "uint64", "uint64"],
                [
                    walletAddress,
                    transferToken?.token?.address,
                    value?.toString(),
                    pegConfig?.pegged_chain_id.toString(),
                    walletAddress,
                    nonce?.toString(),
                    pegConfig?.org_chain_id.toString(),
                ]
            )
            console.log("depositId:", depositId)
            console.log("3. submit an on-chain send transaction");
            let depositTx = await transactor(
                originalTokenVault!.deposit(
                    transferToken?.token?.address, //token address on original chain
                    value,
                    pegConfig?.pegged_chain_id,
                    walletAddress,
                    nonce,
                    {gasLimit: 100000 }
                ),
                srcChainId
            )
            console.log("depositTx hash: " + depositTx.hash);
            console.log("Waiting for the confirmations of depositTx");
            const confirmationReceipt = await getConfirmations(depositTx.hash, confirmations); // instead of waiting for fixed time, wait for some confirmations
            console.log(`depositTx confirmed upto ${confirmationReceipt.confirmations} confirmations`);
            console.log("4. getTransferStatus for this transaction until the transfer is complete or needs a refund");
            statusTracker(rpc, depositId);
        }
    } catch (error: any) {
        console.log(`-Error:`, error)
    }
})()
