import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest

import { config } from "dotenv"
config()

import { getEstimation, getTransferConfigs, requestRefund } from "../APIs"
import { getBridgeContractAddress, getContract } from "../helper"
import BridgeABI from "../contract/abi/Bridge.sol/Bridge.json"

const rpc: string = process.env.CBRIDGE_GATEWAY_URL!
const addr: string = process.env.WALLET_ADDRESS!
const srcChainId = parseInt(process.env.CHAIN1_ID!);

;(async (transferId?: string, type?: string) => {
    const chainId = parseInt(process.env.CHAIN1_ID!);
    const tokenSymbol = process.env.TOKEN_SYMBOL!;
    const amount = process.env.AMOUNT!;
    const slippageTolerance = parseInt(process.env.SLIPPAGE_TOLERANCE!);
     transferId = transferId ? transferId : "BEB2A8B042690205BE60290B076E46CC782CBA32F5301D79AD14252C7E628EEB"; //Replace your transfer Id here
     type = type ? type : "TRANSFER"; //Replace your refund type e.g: "TRANSFER", "MINT" OR "BURN"
    const transferConfigs = await getTransferConfigs(rpc);
    const bridgeAddress = getBridgeContractAddress(transferConfigs, srcChainId)
    const bridgeContract = getContract(bridgeAddress || '', BridgeABI.abi, srcChainId)
    const estimated = await getEstimation(rpc, addr, chainId, tokenSymbol, amount, slippageTolerance)
    if (estimated)
        requestRefund(
            type,
            bridgeContract,
            rpc,
            transferId,
            estimated
        )
})()
