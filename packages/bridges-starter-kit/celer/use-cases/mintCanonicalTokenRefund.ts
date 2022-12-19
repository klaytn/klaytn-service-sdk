import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest
import { base64, getAddress, hexlify } from "ethers/lib/utils";
import { config } from "dotenv"
config()

import { getTransferStatus, getTransferConfigs, requestRefund, getEstimation } from "../core"
import {
    getContract,
    getPegConfig,
    transactor,
} from "../core"
import OriginalTokenVaultABI from '../core/contract/abi/pegged/OriginalTokenVault.sol/OriginalTokenVault.json'
import OriginalTokenVaultV2ABI from '../core/contract/abi/pegged/OriginalTokenVaultV2.sol/OriginalTokenVaultV2.json';

export async function mintCanonicalTokenRefund(
    CBRIDGE_GATEWAY_URL: string,
    WALLET_ADDRESS: string,
    SRC_CHAIN_ID: number,
    DST_CHAIN_ID: number,
    SLIPPAGE_TOLERANCE: number,
    TOKEN_SYMBOL: string,
    DEPOSIT_ID: string,
    AMOUNT: string
) {
    const transferConfigs = await getTransferConfigs(CBRIDGE_GATEWAY_URL);

    const originalTokenVaultAddress = transferConfigs.pegged_pair_configs.find(config => config.org_chain_id === SRC_CHAIN_ID && config.vault_version < 2)?.pegged_deposit_contract_addr
    const originalTokenVault = getContract(originalTokenVaultAddress || '', OriginalTokenVaultABI.abi, SRC_CHAIN_ID)
    const originalTokenVaultV2Address = transferConfigs.pegged_pair_configs.find(config => config.org_chain_id === SRC_CHAIN_ID && config.vault_version === 2)?.pegged_deposit_contract_addr
    const originalTokenVaultV2 = getContract(originalTokenVaultV2Address || '', OriginalTokenVaultV2ABI.abi, SRC_CHAIN_ID)

    const pegConfig = getPegConfig(transferConfigs, SRC_CHAIN_ID, DST_CHAIN_ID, TOKEN_SYMBOL);
    const vaultVersion = pegConfig?.vault_version;
    const originalTokenContract = vaultVersion === 2 ? originalTokenVaultV2 : originalTokenVault;

    console.log("1. Initiating refund request...");
    // Transfer status should not be 0, 5 OR 10
    const transferStatus = await getTransferStatus(CBRIDGE_GATEWAY_URL, DEPOSIT_ID);
    if (transferStatus.status === 0) {
        console.error("cBRIDGE => TRANSFER_ID UNKNOWN / INVALID");
        return;
    } else if (transferStatus.status === 5){
        console.error("cBRIDGE => TRANSFER_ALREADY_COMPLETED / NON_REFUNDABLE");
        return;
    }else if (transferStatus.status === 10){
        console.error("cBRIDGE => TRANSFER_ALREADY_REFUNDED");
        return;
    } else {
        console.log("1. Estimating refund request...");
        const estimated = await getEstimation(CBRIDGE_GATEWAY_URL, WALLET_ADDRESS, SRC_CHAIN_ID, TOKEN_SYMBOL, AMOUNT, SLIPPAGE_TOLERANCE)

        requestRefund(
            "MINT",
            originalTokenContract,
            CBRIDGE_GATEWAY_URL,
            DEPOSIT_ID,
            estimated
        )
    }
}
