import { Swap } from "../../core"
import { KIP7__factory, DexPair } from '../../contracts';
import { Wallet, providers, BigNumber, constants } from 'ethers'
import { config } from 'dotenv'
config()
;(async () => {
    console.log('swapExactTokensForKlay# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const routerAddress = process.env.ROUTER!
    const factoryAddress = process.env.FACTORY!
    const path: string[] = JSON.parse(process.env.SWAP_ROUTE as string)
    const amountIn = process.env.TOKEN_AMOUNT_IN!
    const amountOut = process.env.TOKEN_AMOUNT_OUT!

    if(path.length != 2) throw new Error('swapExactTokensForKlay# invalid path');

    console.log('swapExactTokensForKlay# tokenIn')
    console.log('swapExactTokensForKlay# tokenIn => balance => checking')
    let tokenIn = KIP7__factory.connect(path[0], new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    if((await tokenIn.balanceOf(pubKey)).lt(BigNumber.from((amountIn)))){
        throw new Error("swapExactTokensForKlay# balance => tokenIn => insufficient balance")
    }
    console.log('swapExactTokensForKlay# tokenIn => balance => Good')
    console.log('swapExactTokensForKlay# tokenIn => allowance => checking')

    if((await tokenIn.allowance(pubKey, routerAddress)).gte(BigNumber.from((amountIn)))) {
        console.log('swapExactTokensForKlay# tokenIn => allowance => Good')
    }
    else {
        console.log("swapExactTokensForKlay# tokenIn => allowance => approving");
        let approveTx = await  tokenIn.approve(routerAddress, amountIn)
        console.log("swapExactTokensForKlay# tokenIn => allowance => txHash: "+approveTx.hash);
        console.log("swapExactTokensForKlay# tokenIn => allowance => waiting for confirmations");
        await approveTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
        console.log("swapExactTokensForKlay# tokenIn => allowance => DONE");
    }

    console.log('swapExactTokensForKlay# router => setting up')
    const router = new Swap(routerAddress, factoryAddress, privKey, rpcURL)
    console.log('swapExactTokensForKlay# router => pair => checking')

    if(await router.getAddressOfWKLAY() != path[1]) throw new Error('swapExactTokensForKlay# WKLAY address invalid')

    const pair: DexPair = await router.getPair(path[0], path[1], privKey, rpcURL);
    if (pair.address == constants.AddressZero) throw new Error('SwapExactTokensForKlay# pair => not found');
    console.log('swapExactTokensForKlay# router => pair => found')
    console.log('swapExactTokensForKlay# router => pair => estimating price')
    const reserves = await pair.getReserves()
    const reservesSorted = await pair.token0() == path[0] ? [reserves[0], reserves[1]] : [reserves[1], reserves[0]];
    const outputAmount = await router.router.getAmountOut(amountIn, reservesSorted[0], reservesSorted[1])
    if(outputAmount.lt(BigNumber.from((amountOut)))) throw new Error('swapExactTokensForKlay# pair => insufficient amountIn for expected amountOut')
    console.log('swapExactTokensForKlay# router => pair => Good')
    console.log('swapExactTokensForKlay# router => transaction')
    let deadline: number = Math.floor(new Date().getTime() / 1000) + 600; // 10 minutes window
    const swapTx = await router.exactTokensForKlay(amountIn, amountOut, path, deadline.toString())
    console.log('swapExactTokensForKlay# router => transaction => txHash: ' + swapTx.hash)
    await swapTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
    console.log('swapExactTokensForKlay# router => transaction => confirmed')
    console.log('swapExactTokensForKlay# DONE')



})()
