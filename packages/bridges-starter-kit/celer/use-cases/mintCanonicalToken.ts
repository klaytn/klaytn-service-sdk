import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest
import { config } from "dotenv"
config()

import { getTransferConfigs } from "../core"
import {
    approve,
    checkApprove,
    getAllowance,
    getContract,
    getPegConfig,
    getTransferObject,
    transactor
} from "../core"
import OriginalTokenVaultABI from '../core/contract/abi/pegged/OriginalTokenVault.sol/OriginalTokenVault.json'
import OriginalTokenVaultV2ABI from '../core/contract/abi/pegged/OriginalTokenVaultV2.sol/OriginalTokenVaultV2.json';
import { utils } from "ethers"
import { statusTracker } from "../core"

export async function mintCanonicalToken(
    CBRIDGE_GATEWAY_URL: string,
    WALLET_ADDRESS: string,
    PRIVATE_KEY: string,
    SRC_CHAIN_ID: number,
    DST_CHAIN_ID: number,
    SRC_CHAIN_RPC: string,
    TOKEN_SYMBOL: string,
    AMOUNT: string,
    CONFIRMATIONS: number
): Promise<string> {
    console.log("0. get transfer config for transaction");
    const transferConfigs = await getTransferConfigs(CBRIDGE_GATEWAY_URL)

    const originalTokenVaultAddress = transferConfigs.pegged_pair_configs.find(config => config.org_chain_id === SRC_CHAIN_ID && config.vault_version < 2 && config.pegged_chain_id === DST_CHAIN_ID)?.pegged_deposit_contract_addr
    const originalTokenVault = getContract(originalTokenVaultAddress || '', OriginalTokenVaultABI.abi, SRC_CHAIN_RPC, PRIVATE_KEY)
    const originalTokenVaultV2Address = transferConfigs.pegged_pair_configs.find(config => config.org_chain_id === SRC_CHAIN_ID && config.vault_version === 2 && config.pegged_chain_id === DST_CHAIN_ID)?.pegged_deposit_contract_addr
    const originalTokenVaultV2 = getContract(originalTokenVaultV2Address || '', OriginalTokenVaultV2ABI.abi, SRC_CHAIN_RPC, PRIVATE_KEY)
    if (!originalTokenVaultAddress && !originalTokenVaultV2Address) throw new Error('SRC_CHAIN_ID not yet supported by cBridge');

    // check if its a valid pair transfer
    const isPairPresent = !!(transferConfigs.pegged_pair_configs.filter(chainToken =>
        (chainToken.org_chain_id == SRC_CHAIN_ID
            && chainToken.pegged_chain_id == DST_CHAIN_ID
            && chainToken.pegged_token?.token?.symbol.toUpperCase() == TOKEN_SYMBOL
        )).length > 0);
    if(!isPairPresent) {
        throw new Error("Please choose valid TOKEN_SYMBOL that is supported by given pair of chains");
    }
    const { transferToken, value, nonce } = getTransferObject(
        transferConfigs,
        SRC_CHAIN_ID,
        DST_CHAIN_ID,
        TOKEN_SYMBOL,
        AMOUNT
    )

    const pegConfig = getPegConfig(transferConfigs, SRC_CHAIN_ID, DST_CHAIN_ID, TOKEN_SYMBOL)
    const vaultVersion = pegConfig?.vault_version
    const spenderAddress = vaultVersion === 2 ? originalTokenVaultV2Address : originalTokenVaultAddress

    /**Check user's on-chain token allowance for Originaltoken contract.
     * If the allowance is not enough for user token transfer, trigger the corresponding on-chain approve flow */
    console.log("1. Checking Allowance of tokens to OriginalToken contract");
    const allowance = await getAllowance(
        WALLET_ADDRESS,
        spenderAddress || '',
        transferToken?.token?.address || "",
        SRC_CHAIN_ID,
        transferToken?.token?.symbol,
        SRC_CHAIN_RPC,
        transferConfigs.pegged_pair_configs
    )
    let needToApprove = false;
    const isNative = transferConfigs.chains.filter(chain =>
        (chain.id == SRC_CHAIN_ID && chain.gas_token_symbol.toUpperCase() == TOKEN_SYMBOL.toUpperCase())).length > 0;
    needToApprove = checkApprove(allowance, AMOUNT, transferToken?.token, isNative)

    if (needToApprove) {
        console.log("Approving the tokens");
        const approveTx = await approve(
            spenderAddress || "",
            SRC_CHAIN_RPC,
            PRIVATE_KEY,
            transferToken?.token,
            AMOUNT
        )
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

    try {
        let depositId;
        if (vaultVersion === 2) {
             depositId = utils.solidityKeccak256(
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
                    WALLET_ADDRESS,
                    transferToken?.token?.address,
                    value?.toString(),
                    pegConfig?.pegged_chain_id.toString(),
                    WALLET_ADDRESS,
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
                    WALLET_ADDRESS,
                    nonce,
                    {gasLimit: 200000 }
                ),
                SRC_CHAIN_RPC,
                PRIVATE_KEY
            )

            console.log("depositTx hash: " + depositTx.hash);
            console.log("Waiting for the confirmations of depositTx");
            const confirmationReceipt = await depositTx.wait(CONFIRMATIONS); // instead of waiting for fixed time, wait for some confirmations
            console.log(`depositTx confirmed upto ${confirmationReceipt.confirmations} confirmations`);
            console.log("4. getTransferStatus for this transaction until the transfer is complete or needs a refund");
            statusTracker(CBRIDGE_GATEWAY_URL, depositId);
            return depositId;
        } else {
             depositId = utils.solidityKeccak256(
                ["address", "address", "uint256", "uint64", "address", "uint64", "uint64"],
                [
                    WALLET_ADDRESS,
                    transferToken?.token?.address,
                    value?.toString(),
                    pegConfig?.pegged_chain_id.toString(),
                    WALLET_ADDRESS,
                    nonce?.toString(),
                    pegConfig?.org_chain_id.toString(),
                ]
            )
            console.log("depositId:", depositId)
            console.log("3. submit an on-chain send transaction");
            const depositTx = await transactor(
                originalTokenVault!.deposit(
                    transferToken?.token?.address, //token address on original chain
                    value,
                    pegConfig?.pegged_chain_id,
                    WALLET_ADDRESS,
                    nonce,
                    {gasLimit: 200000 }
                ),
                SRC_CHAIN_RPC,
                PRIVATE_KEY
            )
            console.log("depositTx hash: " + depositTx.hash);
            console.log("Waiting for the confirmations of depositTx");
            const confirmationReceipt = await depositTx.wait(CONFIRMATIONS); // instead of waiting for fixed time, wait for some confirmations
            console.log(`depositTx confirmed upto ${confirmationReceipt.confirmations} confirmations`);
            console.log("4. getTransferStatus for this transaction until the transfer is complete or needs a refund");
            statusTracker(CBRIDGE_GATEWAY_URL, depositId);
            return depositId;
        }
    } catch (error: any) {
        console.log(`-Error:`, error)
        throw new Error(`-Error: ${error}`)
    }
}
