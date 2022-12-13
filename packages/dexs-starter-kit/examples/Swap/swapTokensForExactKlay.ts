import { Liquidity, Swap } from "../../services"
import { KIP7__factory, KIP7, DexPair } from '../../contracts';
import { Wallet, providers, BigNumber, constants } from 'ethers'
import { config } from 'dotenv'
config()
;(async () => {
    console.log('swapTokensForExactKlay# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const routerAddress = process.env.ROUTER!
    const factoryAddress = process.env.FACTORY!
    const path: string[] = JSON.parse(process.env.SWAP_ROUTE as string)
    const amountIn = process.env.TOKEN_AMOUNT_IN!
    const amountOut = process.env.TOKEN_AMOUNT_OUT!

    if(path.length != 2) throw new Error('swapTokensForExactKlay# invalid path');

    console.log('swapTokensForExactKlay# tokenIn')
    console.log('swapTokensForExactKlay# tokenIn => balance => checking')
    let tokenIn = KIP7__factory.connect(path[0], new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    if((await tokenIn.balanceOf(pubKey)).lt(BigNumber.from((amountIn)))){
        throw new Error("swapTokensForExactKlay# balance => tokenIn => insufficient balance")
    }
    console.log('swapTokensForExactKlay# tokenIn => balance => Good')
    console.log('swapTokensForExactKlay# tokenIn => allowance => checking')

    if((await tokenIn.allowance(pubKey, routerAddress)).gte(BigNumber.from((amountIn)))) {
        console.log('swapTokensForExactKlay# tokenIn => allowance => Good')
    }
    else {
        console.log("swapTokensForExactKlay# tokenIn => allowance => approving");
        let approveTx = await  tokenIn.approve(routerAddress, amountIn)
        console.log("swapTokensForExactKlay# tokenIn => allowance => txHash: "+approveTx.hash);
        console.log("swapTokensForExactKlay# tokenIn => allowance => waiting for confirmations");
        await approveTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
        console.log("swapTokensForExactKlay# tokenIn => allowance => DONE");
    }

    console.log('swapTokensForExactKlay# router => setting up')
    const router = new Swap(routerAddress, factoryAddress, privKey, rpcURL)
    console.log('swapTokensForExactKlay# router => pair => checking')
    if(await router.getAddressOfWKLAY() != path[1]) throw new Error('swapExactKlayForTokens => WKLAY address invalid')

    const pair: DexPair = await router.getPair(path[0], path[1], privKey, rpcURL);
    if (pair.address == constants.AddressZero) throw new Error('SwapTokensForExactKlay# pair => not found');
    console.log('swapTokensForExactKlay# router => pair => found')
    console.log('swapTokensForExactKlay# router => pair => estimating price')
    const reserves = await pair.getReserves()
    const reservesSorted = await pair.token0() == path[0] ? [reserves[0], reserves[1]] : [reserves[1], reserves[0]];
    const inputAmount = await router.router.getAmountIn(amountOut, reservesSorted[0], reservesSorted[1])

    if(!inputAmount.lte(BigNumber.from((amountIn)))) throw new Error('swapTokensForExactKlay# pair => insufficient amountIn for expected amountOut')
    console.log('swapTokensForExactKlay# router => pair => Good')
    console.log('swapTokensForExactKlay# router => transaction')
    let deadline: number = Math.floor(new Date().getTime() / 1000) + 600; // 10 minutes window
    const swapTx = await router.tokensForExactKlay(amountOut, amountIn, path, deadline.toString())
    console.log('swapTokensForExactKlay# router => transaction => txHash: ' + swapTx.hash)
    await swapTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
    console.log('swapTokensForExactKlay# router => transaction => confirmed')
    console.log('swapTokensForExactKlay# DONE')

})()
