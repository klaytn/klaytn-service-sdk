import env from "dotenv"
import { expect, assert } from "chai"
import { it } from "mocha"
import { Liquidity, Config } from "../services"
import * as process from "process"
import { ethers, utils, Wallet, Signer } from "ethers"

env.config({path: './test/.env-test'})
describe("Liquidity Service", () => {
    let config: Config;
    let liquidity: Liquidity;
    let deployer: Wallet = getWallet(0)
    let owner2: Wallet = getWallet(1)
    let owner3: Wallet = getWallet(2)
    let user: Wallet = getWallet(3)
    let user1: Wallet = getWallet(4)

    it('should initDex', async () => {
        // config = new Config();
        let router = process.env.ROUTER!;
        let factory = process.env.FACTORY!;
        let rpcURL = process.env.RPC_URL!;
        // @ts-ignore
        expect(process.env.MNEMONIC.length).gt(0, "Invalid MNEMONIC")
        expect(utils.isAddress(router), "invalid ROUTER address")
        expect(utils.isAddress(factory), "invalid FACTORY address")
        expect(rpcURL).contain('http', "invalid RPC_URL")

        liquidity = new Liquidity(router, factory, user.privateKey.toString(), rpcURL);
        // await liquidity.initDex()
        expect(utils.isAddress(liquidity.factory.address), 'factory not initialized')
        expect(utils.isAddress(liquidity.router.address), 'router not initialized')
    })
    it('should add liquidity', async () => {
        let amountADesired = utils.parseEther('1')
        let amountBDesired = utils.parseEther('1')
        let amountAMin = utils.parseEther('0.8')
        let amountBMin = utils.parseEther('0.8')
        let deadline = Date.now()
        Date.UTC()

        liquidity.add(process.env.AAA!, process.env.BBB!, amountADesired, amountBDesired, amountAMin, amountBMin, deadline)
    }

})
function getWallet(index: number): Wallet {
    // @ts-ignore
    return Wallet.fromMnemonic(process.env.MNEMONIC, `m/44'/60'/0'/0/${index}`);
}
