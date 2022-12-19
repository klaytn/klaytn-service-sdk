import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest
import { base64, getAddress, hexlify } from "ethers/lib/utils";
import { config } from "dotenv"
config()

import { getEstimation, requestRefund, getTransferStatus, getTransferConfigs } from "../core"
import { getBridgeContractAddress, getContract, transactor } from "../core"
import BridgeABI from "../core/contract/abi/Bridge.sol/Bridge.json"
import { statusTracker } from "../core"

const rpc: string = process.env.CBRIDGE_GATEWAY_URL!
const walletAddress: string = process.env.WALLET_ADDRESS!

;(async () => {
    const srcChainId = parseInt(process.env.CHAIN1_ID!);
    const tokenSymbol = process.env.TOKEN_SYMBOL!;
    const amount = process.env.AMOUNT!;
    const slippageTolerance = parseInt(process.env.SLIPPAGE_TOLERANCE!);
    const transferId = "0x422be184b0272d0bf8701e1d77f53e5cb74ed2d7d8c47caddd559620d9addc22"; //Replace your transfer Id here
    console.log("0. Initiating refund transfer...");
    const transferConfigs = await getTransferConfigs(rpc);
    const bridgeAddress = getBridgeContractAddress(transferConfigs, srcChainId)
    const bridgeContract = getContract(bridgeAddress || '', BridgeABI.abi, srcChainId)

    // Transfer status should not be 0, 5 OR 10
    const transferStatus = await getTransferStatus(rpc, transferId);
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
            "TRANSFER",
            bridgeContract,
            rpc,
            transferId,
            estimated
        )
    }
})()
