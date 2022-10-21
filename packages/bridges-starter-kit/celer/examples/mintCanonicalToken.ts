import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest
import { config } from "dotenv"
config()

import { getTransferConfigs } from "../APIs"
import { getTransferObject, originalTokenVault, transactor } from "../helper"

const rpc = process.env.CBRIDGE_GATEWAY_URL!
const address = process.env.WALLET_ADDRESS || ""

;(async () => {
    //BUSD on BNB mainnet
    const transferConfigs = await getTransferConfigs(rpc)
    const { transferToken, value, nonce } = getTransferObject(transferConfigs, 8217, 56, "BUSD", "10000")

    try {
        await transactor(
            // eslint-disable-next-line
            originalTokenVault!.deposit(
                transferToken?.token?.address, //token address on original chain
                value,
                8217, //Pegged chain id
                address,
                nonce
            )
        )
    } catch (error: any) {
        console.log(`-Error:`, error)
    }
})()
