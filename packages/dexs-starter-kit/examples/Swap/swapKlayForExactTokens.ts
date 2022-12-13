import { Swap } from "../../services"
import { DexPair } from '../../contracts';
import { Wallet, providers, BigNumber, constants } from 'ethers'
import { config } from 'dotenv'
config()
;(async () => {
    console.log('swapKlayForExactTokens# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const routerAddress = process.env.ROUTER!
    const factoryAddress = process.env.FACTORY!
    const path: string[] = JSON.parse(process.env.SWAP_ROUTE as string)
    const amountIn = process.env.TOKEN_AMOUNT_IN!
    const amountOut = process.env.TOKEN_AMOUNT_OUT!

    if(path.length != 2) throw new Error('swapKlayForExactTokens# invalid path');

    console.log('swapKlayForExactTokens# KLAY')
    console.log('swapKlayForExactTokens# KLAY => balance => checking')
    let balance: BigNumber = await (new Wallet(privKey, new providers.JsonRpcProvider(rpcURL))).getBalance();
    if(balance.lt(BigNumber.from((amountIn)))){
        throw new Error("swapKlayForExactTokens# KLAY => balance => insufficient")
    }
    console.log('swapKlayForExactTokens# KLAY => balance => Good')

    console.log('swapKlayForExactTokens# router => setting up')
    const router = new Swap(routerAddress, factoryAddress, privKey, rpcURL)
    console.log('swapKlayForExactTokens# router => pair => checking')

    if(await router.getAddressOfWKLAY() != path[0]) throw new Error('swapKlayForExactTokens# WKLAY address invalid')

    const pair: DexPair = await router.getPair(path[0], path[1], privKey, rpcURL);
    if (pair.address == constants.AddressZero) throw new Error('SwapKlayForExactTokens# pair => not found');
    console.log('swapKlayForExactTokens# router => pair => found')
    console.log('swapKlayForExactTokens# router => pair => estimating price')
    const reserves = await pair.getReserves()
    const reservesSorted = await pair.token0() == path[0] ? [reserves[0], reserves[1]] : [reserves[1], reserves[0]];
    const inputAmount = await router.router.getAmountIn(amountOut, reservesSorted[0], reservesSorted[1])
    console.log(inputAmount.toString())
    console.log(amountIn)
    if(!inputAmount.lte(BigNumber.from((amountIn)))) throw new Error('swapKlayForExactTokens# pair => insufficient amountIn for expected amountOut')
    console.log('swapKlayForExactTokens# router => pair => Good')
    console.log('swapKlayForExactTokens# router => transaction')
    let deadline: number = Math.floor(new Date().getTime() / 1000) + 600; // 10 minutes window
    const swapTx = await router.klayForExactTokens(amountIn, amountOut, path, deadline.toString())
    console.log('swapKlayForExactTokens# router => transaction => txHash: ' + swapTx.hash)
    await swapTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
    console.log('swapKlayForExactTokens# router => transaction => confirmed')
    console.log('swapKlayForExactTokens# DONE')



})()
