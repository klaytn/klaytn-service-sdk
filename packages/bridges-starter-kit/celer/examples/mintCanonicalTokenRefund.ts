import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest
import { base64, getAddress, hexlify } from "ethers/lib/utils";
import { config } from "dotenv"
config()

import { getTransferStatus, getTransferConfigs, requestRefund, getEstimation } from "../APIs"
import {
    getContract,
    getPegConfig,
    transactor,
} from "../helper"
import OriginalTokenVaultABI from '../contract/abi/pegged/OriginalTokenVault.sol/OriginalTokenVault.json'
import OriginalTokenVaultV2ABI from '../contract/abi/pegged/OriginalTokenVaultV2.sol/OriginalTokenVaultV2.json';

const rpc: string = process.env.CBRIDGE_GATEWAY_URL!
const walletAddress: string = process.env.WALLET_ADDRESS!

;( async () => {
    const srcChainId = parseInt(process.env.CHAIN1_ID!);
    const dstChainId = parseInt(process.env.CHAIN2_ID!);
    const slippageTolerance = parseInt(process.env.SLIPPAGE_TOLERANCE!);
    const tokenSymbol = process.env.TOKEN_SYMBOL!;
    const depositId = "C07B200B9976E3CEC41C7CEE32F183F68A6DD37F43CBCD4C2C360382B76DFCC6"; //Replace your transfer Id here
    const amount = process.env.AMOUNT ? process.env.AMOUNT: "0"; // Replace mint amount here (if not set in .env file)
    const transferConfigs = await getTransferConfigs(rpc);

    const originalTokenVaultAddress = transferConfigs.pegged_pair_configs.find(config => config.org_chain_id === srcChainId && config.vault_version < 2)?.pegged_deposit_contract_addr
    const originalTokenVault = getContract(originalTokenVaultAddress || '', OriginalTokenVaultABI.abi, srcChainId)
    const originalTokenVaultV2Address = transferConfigs.pegged_pair_configs.find(config => config.org_chain_id === srcChainId && config.vault_version === 2)?.pegged_deposit_contract_addr
    const originalTokenVaultV2 = getContract(originalTokenVaultV2Address || '', OriginalTokenVaultV2ABI.abi, srcChainId)

    const pegConfig = getPegConfig(transferConfigs, srcChainId, dstChainId, tokenSymbol);
    const vaultVersion = pegConfig?.vault_version;
    const originalTokenContract = vaultVersion === 2 ? originalTokenVaultV2 : originalTokenVault;

    console.log("1. Initiating refund request...");
    // Transfer status should not be 0, 5 OR 10
    const transferStatus = await getTransferStatus(rpc, depositId);
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
        const estimated = await getEstimation(rpc, walletAddress, srcChainId, tokenSymbol, amount, slippageTolerance)

        requestRefund(
            "MINT",
            originalTokenContract,
            rpc,
            depositId,
            estimated
        )
    }
})()
