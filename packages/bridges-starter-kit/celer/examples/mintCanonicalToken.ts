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
    const transferConfigs = await getTransferConfigs(rpc)

    const srcChainId = 8217 //Klaytn
    const dstChainId = 56 //BNB Chain
    const tokenSymbol = "USDT"
    const amount = "10000"

    const originalTokenVaultAddress = transferConfigs.pegged_pair_configs.find(config => config.org_chain_id === srcChainId && config.vault_version < 0)?.pegged_deposit_contract_addr
    const originalTokenVault = getContract(originalTokenVaultAddress || '', OriginalTokenVaultABI.abi)
    const originalTokenVaultV2Address = transferConfigs.pegged_pair_configs.find(config => config.org_chain_id === srcChainId && config.vault_version === 2)?.pegged_deposit_contract_addr
    const originalTokenVaultV2 = getContract(originalTokenVaultV2Address || '', OriginalTokenVaultV2ABI.abi)

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
    const allowance = await getAllowance(
        walletAddress,
        spenderAddress || '',
        transferToken?.token?.address || "",
        srcChainId,
        transferToken?.token?.symbol,
        transferConfigs.pegged_pair_configs
    )
    let needToApprove = false
    needToApprove = checkApprove(allowance, amount, transferToken?.token)

    if (needToApprove) {
        const approveTx = await approve(
            spenderAddress || "",
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
            await transactor(
                // eslint-disable-next-line
                originalTokenVaultV2!.deposit(
                    transferToken?.token?.address, //token address on original chain
                    value,
                    pegConfig?.pegged_chain_id,
                    walletAddress,
                    nonce
                )
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
            await transactor(
                // eslint-disable-next-line
                originalTokenVault!.deposit(
                    transferToken?.token?.address, //token address on original chain
                    value,
                    pegConfig?.pegged_chain_id,
                    walletAddress,
                    nonce
                )
            )
        }
    } catch (error: any) {
        console.log(`-Error:`, error)
    }
})()
