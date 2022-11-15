import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest

import { config } from "dotenv"
config()

import { getEstimation, requestRefund } from "../APIs"

const rpc: string = process.env.CBRIDGE_GATEWAY_URL!
const addr: string = process.env.WALLET_ADDRESS!

;(async () => {
    const chainId = parseInt(process.env.CHAIN1_ID!);
    const tokenSymbol = process.env.TOKEN_SYMBOL!;
    const amount = process.env.AMOUNT!;
    const slippageTolerance = parseInt(process.env.SLIPPAGE_TOLERANCE!);
    const transferId = "0x56db0c7245e9fac0e66b393467cafabfe0c15bfb1b27af9b140bd4b6c3b3e60e"; //Replace your transfer Id here

    const estimated = await getEstimation(rpc, addr, chainId, tokenSymbol, amount, slippageTolerance)
    if (estimated)
        requestRefund(
            rpc,
            transferId,
            estimated
        )
})()
