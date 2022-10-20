import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest
import { config } from "dotenv"
config()

import { originalTokenVault, transactor } from "../helper"
import { safeParseUnits } from "celer-web-utils/lib/format"

const address = process.env.WALLET_ADDRESS || ""

;(async () => {
    //BUSD on BNB mainnet
    const peggedToken = {
        token: {
            symbol: "USDC",
            address: "0x53bB26dc8C5EFC6c95C37155aCa487d1D043436a",
            decimal: 6,
            xfer_disabled: true,
        },
        name: "USD Coin (Celer)",
        icon: "https://get.celer.app/cbridge-icons/USDC.png",
        inbound_lmt: "",
        inbound_epoch_cap: "",
        transfer_disabled: false,
        liq_add_disabled: false,
        liq_rm_disabled: false,
        liq_agg_rm_src_disabled: false,
    }

    const value = safeParseUnits("10000", peggedToken?.token?.decimal ?? 18)
    const nonce = new Date().getTime()

    try {
        await transactor(
            // eslint-disable-next-line
            originalTokenVault!.deposit(
                peggedToken.token.address, //token address on pegged chain
                value,
                address,
                nonce
            )
        )
    } catch (error: any) {
        console.log(`-Error:`, error)
    }
})()
