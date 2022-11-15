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
    getContract,
    getPegConfig,
    getTransferObject,
    transactor,
} from "../helper"
import OriginalTokenVaultABI from '../contract/abi/pegged/OriginalTokenVault.sol/OriginalTokenVault.json'
import OriginalTokenVaultV2ABI from '../contract/abi/pegged/OriginalTokenVaultV2.sol/OriginalTokenVaultV2.json';
import { ethers } from "ethers"

const rpc = process.env.CBRIDGE_GATEWAY_URL!
const walletAddress = process.env.WALLET_ADDRESS || ""

;(async () => {
    console.log("0. get transfer config for transaction");
    const transferConfigs = await getTransferConfigs(rpc)

    const srcChainId = parseInt(process.env.CHAIN1_ID!);
    const dstChainId = parseInt(process.env.CHAIN2_ID!);
    const tokenSymbol =  process.env.TOKEN_SYMBOL!;
    const amount = process.env.AMOUNT!;

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

    /**Check user's on-chain token allowance for cBridge contract.
     * If the allowance is not enough for user token transfer, trigger the corresponding on-chain approve flow */
    console.log("1. Checking Allowance of tokens to cBridge contract");
    const allowance = await getAllowance(
        walletAddress,
        spenderAddress || '',
        transferToken?.token?.address || "",
        srcChainId,
        transferToken?.token?.symbol,
        transferConfigs.pegged_pair_configs
    )
    let needToApprove = false;
    needToApprove = checkApprove(allowance, amount, transferToken?.token)

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
        console.log(approveTx);
        console.log("Delaying for 300 seconds before performing the transaction");
        await new Promise(r => setTimeout(r, 300000))
    }

    try {
        if (vaultVersion === 2) {
            const transferId = ethers.utils.solidityKeccak256(
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
            console.log("TransferId:", transferId)
            console.log("3. submit an on-chain send transaction");
            await transactor(
                originalTokenVaultV2!.deposit(
                    transferToken?.token?.address, //token address on original chain
                    value,
                    pegConfig?.pegged_chain_id,
                    walletAddress,
                    nonce
                ),
                srcChainId
            )
        } else {
            const transferId = ethers.utils.solidityKeccak256(
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
            console.log("TransferId:", transferId)
            console.log("3. submit an on-chain send transaction");
            let result = await transactor(
                originalTokenVault!.deposit(
                    transferToken?.token?.address, //token address on original chain
                    value,
                    pegConfig?.pegged_chain_id,
                    walletAddress,
                    nonce
                ),
                srcChainId
            )
            console.log(result);
            console.log("Check the transfer status of the transaction");
        }
    } catch (error: any) {
        console.log(`-Error:`, error)
    }
})()
