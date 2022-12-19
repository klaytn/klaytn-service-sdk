import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest
import { config } from "dotenv"
config()

import { getTransferStatus, getTransferConfigs, requestRefund, getEstimation } from "../core"
import {
    getContract,
    getPegConfig,
    transactor,
} from "../core";
import PeggedTokenBridgeABI from '../core/contract/abi/pegged/PeggedTokenBridge.sol/PeggedTokenBridge.json';
import PeggedTokenBridgeV2ABI from '../core/contract/abi/pegged/PeggedTokenBridgeV2.sol/PeggedTokenBridgeV2.json';

export async function burnCanonicalTokenRefund(
    CBRIDGE_GATEWAY_URL: string,
    WALLET_ADDRESS: string,
    DST_CHAIN_ID: number,
    SRC_CHAIN_ID: number,
    SLIPPAGE_TOLERANCE: number,
    TOKEN_SYMBOL: string,
    BURN_ID: string,
    AMOUNT: string
) {

    // const BURN_ID = "0x8b7b9a37a88342c5e0c53b518544a073b46d1677c490d2c4a9eb663404b36421"; //Replace your transfer Id here
    // const amount = process.env.AMOUNT ? process.env.AMOUNT: "0"; // Replace mint amount here (if not set in .env file)

    const transferConfigs = await getTransferConfigs(CBRIDGE_GATEWAY_URL);

    const peggedTokenBridgeAddress = transferConfigs.pegged_pair_configs.find(config => config.pegged_chain_id === DST_CHAIN_ID && config.bridge_version < 2)?.pegged_burn_contract_addr
    const peggedTokenBridge = getContract(peggedTokenBridgeAddress || '', PeggedTokenBridgeABI.abi, DST_CHAIN_ID)
    const peggedTokenBridgeV2Address = transferConfigs.pegged_pair_configs.find(config => config.pegged_chain_id === DST_CHAIN_ID && config.bridge_version === 2)?.pegged_burn_contract_addr
    const peggedTokenBridgeV2 = getContract(peggedTokenBridgeV2Address || '', PeggedTokenBridgeV2ABI.abi, DST_CHAIN_ID)

    const pegConfig = getPegConfig(transferConfigs, DST_CHAIN_ID, SRC_CHAIN_ID, TOKEN_SYMBOL)
    const bridgeVersion = pegConfig?.bridge_version;
    const peggedTokenContact = bridgeVersion === 2 ? peggedTokenBridgeV2: peggedTokenBridge;

    console.log("1. Initiating refund request");
    // Transfer status should not be 0, 5 OR 10
    const transferStatus = await getTransferStatus(CBRIDGE_GATEWAY_URL, BURN_ID);
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
        const estimated = await getEstimation(CBRIDGE_GATEWAY_URL, WALLET_ADDRESS, DST_CHAIN_ID, TOKEN_SYMBOL, AMOUNT, SLIPPAGE_TOLERANCE)

        requestRefund(
            "BURN",
            peggedTokenContact,
            CBRIDGE_GATEWAY_URL,
            BURN_ID,
            estimated
        )
    }

}
