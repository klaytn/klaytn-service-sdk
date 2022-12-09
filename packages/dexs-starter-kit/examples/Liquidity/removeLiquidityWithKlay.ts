import { Liquidity } from '../../services';
import { DexPair } from '../../contracts';
import { BigNumber } from 'ethers'
import { config } from 'dotenv'
config()
;(async () => {
    console.log('removeLiquidityKlay => initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const routerAddress = process.env.ROUTER!
    const factoryAddress = process.env.FACTORY!
    const tokenAddress = process.env.TOKEN_0!
    const tokenMinAmount = process.env.TOKEN_0_AMOUNT_MIN!
    const klayMinAmount = process.env.TOKEN_1_AMOUNT_MIN!
    const liquidityAmount = process.env.LIQUIDITY!

    console.log('removeLiquidityKlay => router')
    console.log('removeLiquidityKlay => router => setting up')
    let router = new Liquidity(routerAddress, factoryAddress, privKey, rpcURL);
    let klayAddress = await router.getAddressOfWKLAY();
    console.log('removeLiquidityKlay => router => pair')
    console.log('removeLiquidityKlay => router => pair => fetching')
    let pair: DexPair = await router.getPair(tokenAddress, klayAddress, privKey, rpcURL);
    console.log('removeLiquidityKlay => router => pair => found')
    console.log('removeLiquidityKlay => router => pair => balance')
    console.log('removeLiquidityKlay => router => pair => balance => checking')
    let balance = await pair.balanceOf(pubKey)
    if (balance.lt(BigNumber.from((liquidityAmount)))) throw new Error('removeLiquidityKlay => router => pair => balance => insufficient')
    else console.log('removeLiquidityKlay => router => pair => balance => Good')

    console.log('removeLiquidityKlay => router => pair => allowance')
    console.log('removeLiquidityKlay => router => pair => allowance => checking')
    let allowance = await pair.allowance(pubKey, routerAddress)
    if (allowance.lt(BigNumber.from((liquidityAmount)))) {
        console.log('removeLiquidityKlay => router => pair => allowance => approving')
        let approveTx = await  pair.approve(routerAddress, liquidityAmount)
        console.log('removeLiquidityKlay => router => pair => allowance => txHash: '+approveTx.hash)
        console.log('removeLiquidityKlay => router => pair => allowance => waiting for confirmations')
        await approveTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
        console.log('removeLiquidityKlay => router => pair => allowance => Good')
    }
    else console.log('removeLiquidityKlay => router => pair => allowance => Good')

    console.log('removeLiquidityKlay => router => pair => Good')
    let deadline: number = Math.floor(new Date().getTime() / 1000) + 600; // 10 minutes window
    console.log('removeLiquidityKlay => router => transaction')
    let removeTx = await router.removeWithKlay(pair, liquidityAmount, tokenMinAmount, klayMinAmount, deadline.toString());
    console.log('removeLiquidityKlay => router => transaction => txHash: '+removeTx.hash)
    console.log('removeLiquidityKlay => router => waiting for confirmations')
    await removeTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
    console.log('removeLiquidityKlay => router => DONE')
    console.log('removeLiquidityKlay => Liquidity has been removed')

})()
