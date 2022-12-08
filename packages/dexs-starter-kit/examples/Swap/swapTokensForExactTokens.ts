import { Liquidity, Swap } from "../../services"
import { KIP7__factory, KIP7, DexPair } from '@klaytn/dex-contracts/typechain';
import { Wallet, providers, BigNumber, constants } from 'ethers'
import { config } from 'dotenv'
config()
;(async () => {
    console.log('swapTokensForExactTokens => initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const routerAddress = process.env.ROUTER!
    const factoryAddress = process.env.FACTORY!
    const path: string[] = JSON.parse(process.env.SWAP_ROUTE as string)
    const amountIn = process.env.TOKEN_AMOUNT_IN!
    const amountOut = process.env.TOKEN_AMOUNT_OUT!

    if(path.length < 2) throw new Error('swapTokensForExactTokens => invalid path');

    console.log('swapTokensForExactTokens => tokenIn')
    console.log('swapTokensForExactTokens => tokenIn => balance => checking')
    let tokenIn = KIP7__factory.connect(path[0], new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    if((await tokenIn.balanceOf(pubKey)).lt(BigNumber.from((amountIn)))){
        throw new Error("swapTokensForExactTokens => balance => tokenIn => insufficient balance")
    }
    console.log('swapTokensForExactTokens => tokenIn => balance => Good')
    console.log('swapTokensForExactTokens => tokenIn => allowance => checking')

    if((await tokenIn.allowance(pubKey, routerAddress)).gte(BigNumber.from((amountIn)))) {
        console.log('swapTokensForExactTokens => tokenIn => allowance => Good')
    }
    else {
        console.log("swapTokensForExactTokens => tokenIn => allowance => approving");
        let approveTx = await  tokenIn.approve(routerAddress, amountIn)
        console.log("swapTokensForExactTokens => tokenIn => allowance => txHash: "+approveTx.hash);
        console.log("swapTokensForExactTokens => tokenIn => allowance => waiting for confirmations");
        await approveTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
        console.log("swapTokensForExactTokens => tokenIn => allowance => DONE");
    }

    console.log('swapTokensForExactTokens => router => setting up')
    const router = new Swap(routerAddress, factoryAddress, privKey, rpcURL)
    console.log('swapTokensForExactTokens => router => pair => checking')

    const pair: DexPair = await router.getPair(path[0], path[1], privKey, rpcURL);
    if (pair.address == constants.AddressZero) throw new Error('SwapTokensForExactTokens => pair => not found');
    console.log('swapTokensForExactTokens => router => pair => found')
    const reserves = await pair.getReserves()
    const reservesSorted = await pair.token0() == path[0] ? [reserves[0], reserves[1]] : [reserves[1], reserves[0]];
    const inputAmount = await router.router.getAmountIn(amountOut, reservesSorted[0], reservesSorted[1])

    if(!inputAmount.lte(BigNumber.from((amountIn)))) throw new Error('swapTokensForExactTokens => pair => insufficient amountIn for expected amountOut')
    console.log('swapTokensForExactTokens => router => transaction')
    let deadline: number = Math.floor(new Date().getTime() / 1000) + 600; // 10 minutes window
    const swapTx = await router.tokensForExactTokens(amountOut, amountIn, path, deadline.toString())
    console.log('swapTokensForExactTokens => router => transaction => txHash: ' + swapTx.hash)
    await swapTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
    console.log('swapTokensForExactTokens => router => transaction => confirmed')
    console.log('swapTokensForExactTokens => DONE')

})()
