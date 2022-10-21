import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest

import { config } from "dotenv"
config()

import { getEstimation, requestRefund } from "../APIs"

const rpc: string = process.env.CBRIDGE_GATEWAY_URL!
const addr: string = process.env.WALLET_ADDRESS!

;(async () => {
    const estimated = await getEstimation(rpc, addr, 8217, "USDT", "10000", 1000000)
    if (estimated)
        requestRefund(
            rpc,
            "0x56db0c7245e9fac0e66b393467cafabfe0c15bfb1b27af9b140bd4b6c3b3e60e",
            estimated
        )
})()
