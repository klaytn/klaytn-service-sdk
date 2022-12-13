import { Swap } from "../../services"
import { DexPair } from '../../contracts';
import { Wallet, providers, BigNumber, constants } from 'ethers'
import { config } from 'dotenv'
config()
;(async () => {
    console.log('swapExactKlayForTokens# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const routerAddress = process.env.ROUTER!
    const factoryAddress = process.env.FACTORY!
    const path: string[] = JSON.parse(process.env.SWAP_ROUTE as string)
    const amountIn = process.env.TOKEN_AMOUNT_IN!
    const amountOut = process.env.TOKEN_AMOUNT_OUT!

    if(path.length != 2) throw new Error('swapExactKlayForTokens# invalid path');

    console.log('swapExactKlayForTokens# KLAY')
    console.log('swapExactKlayForTokens# KLAY => balance => checking')
    let balance: BigNumber = await (new Wallet(privKey, new providers.JsonRpcProvider(rpcURL))).getBalance();
    if(balance.lt(BigNumber.from((amountIn)))){
        throw new Error("swapExactKlayForTokens# KLAY => balance => insufficient")
    }
    console.log('swapExactKlayForTokens# KLAY => balance => Good')

    console.log('swapExactKlayForTokens# router => setting up')
    const router = new Swap(routerAddress, factoryAddress, privKey, rpcURL)
    console.log('swapExactKlayForTokens# router => pair => checking')

    if(await router.getAddressOfWKLAY() != path[0]) throw new Error('swapExactKlayForTokens# WKLAY address invalid')

    const pair: DexPair = await router.getPair(path[0], path[1], privKey, rpcURL);
    if (pair.address == constants.AddressZero) throw new Error('SwapExactKlayForTokens# pair => not found');
    console.log('swapExactKlayForTokens# router => pair => found')
    console.log('swapExactKlayForTokens# router => pair => estimating price')
    const reserves = await pair.getReserves()
    const reservesSorted = await pair.token0() == path[0] ? [reserves[0], reserves[1]] : [reserves[1], reserves[0]];
    const outputAmount = await router.router.getAmountOut(amountIn, reservesSorted[0], reservesSorted[1])

    if(!outputAmount.gte(BigNumber.from((amountOut)))) throw new Error('swapExactKlayForTokens# pair => insufficient amountIn for expected amountOut')
    console.log('swapExactKlayForTokens# router => pair => Good')
    console.log('swapExactKlayForTokens# router => transaction')
    let deadline: number = Math.floor(new Date().getTime() / 1000) + 600; // 10 minutes window
    const swapTx = await router.exactKlayForTokens(amountIn, amountOut, path, deadline.toString())
    console.log('swapExactKlayForTokens# router => transaction => txHash: ' + swapTx.hash)
    await swapTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
    console.log('swapExactKlayForTokens# router => transaction => confirmed')
    console.log('swapExactKlayForTokens# DONE')



})()
