import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest
import { config } from "dotenv"
config()

import { getTransferStatus, getTransferConfigs, requestRefund, getEstimation } from "../core"
import {
    getContract,
    getPegConfig,
} from "../core";
import PeggedTokenBridgeABI from '../core/contract/abi/pegged/PeggedTokenBridge.sol/PeggedTokenBridge.json';
import PeggedTokenBridgeV2ABI from '../core/contract/abi/pegged/PeggedTokenBridgeV2.sol/PeggedTokenBridgeV2.json';
import { ContractReceipt } from "ethers"

export async function burnCanonicalTokenRefund(
    CBRIDGE_GATEWAY_URL: string,
    WALLET_ADDRESS: string,
    SRC_CHAIN_ID: number,
    DST_CHAIN_ID: number,
    SRC_CHAIN_RPC: string,
    PRIVATE_KEY: string,
    SLIPPAGE_TOLERANCE: number,
    TOKEN_SYMBOL: string,
    BURN_ID: string,
    AMOUNT: string,
    CONFIRMATIONS: number
): Promise<ContractReceipt> {

    // const BURN_ID = "0x8b7b9a37a88342c5e0c53b518544a073b46d1677c490d2c4a9eb663404b36421"; //Replace your transfer Id here
    // const amount = process.env.AMOUNT ? process.env.AMOUNT: "0"; // Replace mint amount here (if not set in .env file)

    const transferConfigs = await getTransferConfigs(CBRIDGE_GATEWAY_URL);

    const peggedTokenBridgeAddress = transferConfigs.pegged_pair_configs.find(config => config.pegged_chain_id === SRC_CHAIN_ID && config.bridge_version < 2)?.pegged_burn_contract_addr
    const peggedTokenBridge = getContract(peggedTokenBridgeAddress || '', PeggedTokenBridgeABI.abi, SRC_CHAIN_RPC, PRIVATE_KEY)
    const peggedTokenBridgeV2Address = transferConfigs.pegged_pair_configs.find(config => config.pegged_chain_id === SRC_CHAIN_ID && config.bridge_version === 2)?.pegged_burn_contract_addr
    const peggedTokenBridgeV2 = getContract(peggedTokenBridgeV2Address || '', PeggedTokenBridgeV2ABI.abi, SRC_CHAIN_RPC, PRIVATE_KEY)
    if (!peggedTokenBridgeAddress && !peggedTokenBridgeV2Address) throw new Error('SRC_CHAIN_ID not supported by cBridge');
    const pegConfig = getPegConfig(transferConfigs, SRC_CHAIN_ID, DST_CHAIN_ID, TOKEN_SYMBOL)
    const bridgeVersion = pegConfig?.bridge_version;
    const peggedTokenContact = bridgeVersion === 2 ? peggedTokenBridgeV2: peggedTokenBridge;

    console.log("1. Initiating refund request");
    // Transfer status should not be 0, 5 OR 10
    const transferStatus = await getTransferStatus(CBRIDGE_GATEWAY_URL, BURN_ID);
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
            "BURN",
            peggedTokenContact,
            CBRIDGE_GATEWAY_URL,
            BURN_ID,
            estimated,
            SRC_CHAIN_RPC,
            PRIVATE_KEY,
            CONFIRMATIONS
        ) as ContractReceipt
    }

}
