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
} from "../helper";
import PeggedTokenBridgeABI from '../contract/abi/pegged/PeggedTokenBridge.sol/PeggedTokenBridge.json';
import PeggedTokenBridgeV2ABI from '../contract/abi/pegged/PeggedTokenBridgeV2.sol/PeggedTokenBridgeV2.json';

const rpc: string = process.env.CBRIDGE_GATEWAY_URL!
const walletAddress: string = process.env.WALLET_ADDRESS!

;(async () => {
    const srcChainId = parseInt(process.env.CHAIN2_ID!);
    const dstChainId = parseInt(process.env.CHAIN1_ID!);

    const slippageTolerance = parseInt(process.env.SLIPPAGE_TOLERANCE!);
    const tokenSymbol = process.env.TOKEN_SYMBOL!;
    const transferId = "0x6085feec485c109c7c23b2bee61b2ca3f8a78418ac859e48f088f24914a60b6d"; //Replace your transfer Id here
    const amount = process.env.AMOUNT ? process.env.AMOUNT: "0"; // Replace mint amount here (if not set in .env file)

    const transferConfigs = await getTransferConfigs(rpc);

    const peggedTokenBridgeAddress = transferConfigs.pegged_pair_configs.find(config => config.pegged_chain_id === srcChainId && config.bridge_version < 2)?.pegged_burn_contract_addr
    const peggedTokenBridge = getContract(peggedTokenBridgeAddress || '', PeggedTokenBridgeABI.abi, srcChainId)
    const peggedTokenBridgeV2Address = transferConfigs.pegged_pair_configs.find(config => config.pegged_chain_id === srcChainId && config.bridge_version === 2)?.pegged_burn_contract_addr
    const peggedTokenBridgeV2 = getContract(peggedTokenBridgeV2Address || '', PeggedTokenBridgeV2ABI.abi, srcChainId)

    const pegConfig = getPegConfig(transferConfigs, srcChainId, dstChainId, tokenSymbol)
    const bridgeVersion = pegConfig?.bridge_version;
    const peggedTokenContact = bridgeVersion === 2 ? peggedTokenBridgeV2: peggedTokenBridge;

    console.log("1. Initiating refund request");
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
            "BURN",
            peggedTokenContact,
            rpc,
            transferId,
            estimated
        )
    }

})()
