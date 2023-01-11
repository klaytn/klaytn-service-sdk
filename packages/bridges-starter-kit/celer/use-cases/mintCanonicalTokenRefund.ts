import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest
import { config } from "dotenv"
config()

import { getTransferStatus, getTransferConfigs, requestRefund, getEstimation } from "../core"
import {
    getContract,
    getPegConfig,
} from "../core"
import OriginalTokenVaultABI from '../core/contract/abi/pegged/OriginalTokenVault.sol/OriginalTokenVault.json'
import OriginalTokenVaultV2ABI from '../core/contract/abi/pegged/OriginalTokenVaultV2.sol/OriginalTokenVaultV2.json';
import { ContractReceipt } from "ethers"

export async function mintCanonicalTokenRefund(
    CBRIDGE_GATEWAY_URL: string,
    WALLET_ADDRESS: string,
    PRIVATE_KEY: string,
    SRC_CHAIN_ID: number,
    DST_CHAIN_ID: number,
    SRC_CHAIN_RPC: string,
    SLIPPAGE_TOLERANCE: number,
    TOKEN_SYMBOL: string,
    DEPOSIT_ID: string,
    AMOUNT: string,
    CONFIRMATIONS: number
): Promise<ContractReceipt> {
    const transferConfigs = await getTransferConfigs(CBRIDGE_GATEWAY_URL);

    const originalTokenVaultAddress = transferConfigs.pegged_pair_configs.find(config => config.org_chain_id === SRC_CHAIN_ID && config.vault_version < 2)?.pegged_deposit_contract_addr
    const originalTokenVault = getContract(originalTokenVaultAddress || '', OriginalTokenVaultABI.abi, SRC_CHAIN_RPC, PRIVATE_KEY)
    const originalTokenVaultV2Address = transferConfigs.pegged_pair_configs.find(config => config.org_chain_id === SRC_CHAIN_ID && config.vault_version === 2)?.pegged_deposit_contract_addr
    const originalTokenVaultV2 = getContract(originalTokenVaultV2Address || '', OriginalTokenVaultV2ABI.abi, SRC_CHAIN_RPC, PRIVATE_KEY)

    const pegConfig = getPegConfig(transferConfigs, SRC_CHAIN_ID, DST_CHAIN_ID, TOKEN_SYMBOL);
    const vaultVersion = pegConfig?.vault_version;
    const originalTokenContract = vaultVersion === 2 ? originalTokenVaultV2 : originalTokenVault;

    console.log("1. Initiating refund request...");
    // Transfer status should not be 0, 5 OR 10
    const transferStatus = await getTransferStatus(CBRIDGE_GATEWAY_URL, DEPOSIT_ID);
    if (transferStatus.status === 0) {
        throw new Error("cBRIDGE => TRANSFER_ID UNKNOWN / INVALID");

    } else if (transferStatus.status === 5){
        throw new Error("cBRIDGE => TRANSFER_ALREADY_COMPLETED / NON_REFUNDABLE");

    }else if (transferStatus.status === 10){
        throw new Error("cBRIDGE => TRANSFER_ALREADY_REFUNDED");

    } else {
        console.log("1. Estimating refund request...");
        const estimated = await getEstimation(CBRIDGE_GATEWAY_URL, WALLET_ADDRESS, SRC_CHAIN_ID, TOKEN_SYMBOL, AMOUNT, SLIPPAGE_TOLERANCE)

        return await requestRefund(
            "MINT",
            originalTokenContract,
            CBRIDGE_GATEWAY_URL,
            DEPOSIT_ID,
            estimated,
            SRC_CHAIN_RPC,
            PRIVATE_KEY,
            CONFIRMATIONS
        ) as ContractReceipt
    }
}
