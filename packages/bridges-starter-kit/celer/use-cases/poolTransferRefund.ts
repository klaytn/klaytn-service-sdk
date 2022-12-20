import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest
import { base64, getAddress, hexlify } from "ethers/lib/utils";
import { config } from "dotenv"
config()

import { getEstimation, requestRefund, getTransferStatus, getTransferConfigs } from "../core"
import { getBridgeContractAddress, getContract, transactor } from "../core"
import BridgeABI from "../core/contract/abi/Bridge.sol/Bridge.json"

export async function poolTransferRefund(
    CBRIDGE_GATEWAY_URL: string,
    WALLET_ADDRESS: string,
    PRIVATE_KEY: string,
    SRC_CHAIN_ID: number,
    SRC_CHAIN_RPC: string,
    TOKEN_SYMBOL: string,
    AMOUNT: string,
    SLIPPAGE_TOLERANCE: number,
    TRANSFER_ID: string,
    CONFIRMATIONS: number
) {
   console.log("0. Initiating refund transfer...");
    const transferConfigs = await getTransferConfigs(CBRIDGE_GATEWAY_URL);
    const bridgeAddress = getBridgeContractAddress(transferConfigs, SRC_CHAIN_ID)
    const bridgeContract = getContract(bridgeAddress || '', BridgeABI.abi, SRC_CHAIN_RPC, PRIVATE_KEY)

    // Transfer status should not be 0, 5 OR 10
    const transferStatus = await getTransferStatus(CBRIDGE_GATEWAY_URL, TRANSFER_ID);
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
            "TRANSFER",
            bridgeContract,
            CBRIDGE_GATEWAY_URL,
            TRANSFER_ID,
            estimated,
            SRC_CHAIN_RPC,
            PRIVATE_KEY,
            CONFIRMATIONS
        )
    }
}
