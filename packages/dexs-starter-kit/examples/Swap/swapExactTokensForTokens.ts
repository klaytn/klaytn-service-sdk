import { Liquidity, Swap } from "../../services"
import { KIP7__factory, KIP7, DexPair } from '@klaytn/dex-contracts/typechain';
import { Wallet, providers, BigNumber, constants } from 'ethers'
import { config } from 'dotenv'
config()
;(async () => {
    console.log('swapExactTokensForTokens => initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const routerAddress = process.env.ROUTER!
    const factoryAddress = process.env.FACTORY!
    const path: string[] = JSON.parse(process.env.SWAP_ROUTE as string)
    const amountIn = process.env.TOKEN_AMOUNT_IN!
    const amountOut = process.env.TOKEN_AMOUNT_OUT!

    if(path.length != 2) throw new Error('swapExactTokensForTokens => invalid path');

    console.log('swapExactTokensForTokens => tokenIn')
    console.log('swapExactTokensForTokens => tokenIn => balance => checking')
    let tokenIn = KIP7__factory.connect(path[0], new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    if((await tokenIn.balanceOf(pubKey)).lt(BigNumber.from((amountIn)))){
        throw new Error("swapExactTokensForTokens => balance => tokenIn => insufficient balance")
    }
    console.log('swapExactTokensForTokens => tokenIn => balance => Good')
    console.log('swapExactTokensForTokens => tokenIn => allowance => checking')

    if((await tokenIn.allowance(pubKey, routerAddress)).gte(BigNumber.from((amountIn)))) {
        console.log('swapExactTokensForTokens => tokenIn => allowance => Good')
    }
    else {
        console.log("swapExactTokensForTokens => tokenIn => allowance => approving");
        let approveTx = await  tokenIn.approve(routerAddress, amountIn)
        console.log("swapExactTokensForTokens => tokenIn => allowance => txHash: "+approveTx.hash);
        console.log("swapExactTokensForTokens => tokenIn => allowance => waiting for confirmations");
        await approveTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
        console.log("swapExactTokensForTokens => tokenIn => allowance => DONE");
    }

    console.log('swapExactTokensForTokens => router => setting up')
    const router = new Swap(routerAddress, factoryAddress, privKey, rpcURL)
    console.log('swapExactTokensForTokens => router => pair => checking')

    const pair: DexPair = await router.getPair(path[0], path[1], privKey, rpcURL);
    if (pair.address == constants.AddressZero) throw new Error('SwapExactTokensForTokens => pair => not found');
    console.log('swapExactTokensForTokens => router => pair => found')
    console.log('swapExactTokensForTokens => router => pair => estimating price')
    const reserves = await pair.getReserves()
    const reservesSorted = await pair.token0() == path[0] ? [reserves[0], reserves[1]] : [reserves[1], reserves[0]];
    const outputAmount = await router.router.getAmountOut(amountIn, reservesSorted[0], reservesSorted[1])
    if(outputAmount.lt(BigNumber.from((amountOut)))) throw new Error('swapExactTokensForTokens => pair => insufficient amountIn for expected amountOut')
    console.log('swapExactTokensForTokens => router => pair => Good')
    console.log('swapExactTokensForTokens => router => transaction')
    let deadline: number = Math.floor(new Date().getTime() / 1000) + 600; // 10 minutes window
    const swapTx = await router.exactTokensForTokens(amountIn, amountOut, path, deadline.toString())
    console.log('swapExactTokensForTokens => router => transaction => txHash: ' + swapTx.hash)
    await swapTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
    console.log('swapExactTokensForTokens => router => transaction => confirmed')
    console.log('swapExactTokensForTokens => DONE')



})()
