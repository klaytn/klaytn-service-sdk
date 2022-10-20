import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest
import { config } from "dotenv"
config()

import { originalTokenVault, transactor } from "../helper"
import { safeParseUnits } from "celer-web-utils/lib/format"

const address = process.env.WALLET_ADDRESS || "";

(async () => {
    //BUSD on BNB mainnet
    const originalToken = {
        token: {
            symbol: "BUSD",
            address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
            decimal: 18,
            xfer_disabled: false,
        },
        name: "Binance USD",
        icon: "https://get.celer.app/cbridge-icons/BUSD.png",
        inbound_lmt: "",
        inbound_epoch_cap: "",
        transfer_disabled: false,
        liq_add_disabled: false,
        liq_rm_disabled: false,
        liq_agg_rm_src_disabled: false,
    }

    const value = safeParseUnits("10000", originalToken?.token?.decimal ?? 18)
    const nonce = new Date().getTime()

    try {
        await transactor(
            // eslint-disable-next-line
            originalTokenVault!.deposit(
                originalToken.token.address, //token address on original chain
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
