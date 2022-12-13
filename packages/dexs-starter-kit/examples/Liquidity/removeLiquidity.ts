import { Liquidity } from '../../core';
import { DexPair } from '../../contracts';
import { BigNumber } from 'ethers'
import { config } from 'dotenv'
config()
;(async () => {
    console.log('removeLiquidity# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const routerAddress = process.env.ROUTER!
    const factoryAddress = process.env.FACTORY!
    const token0Address = process.env.TOKEN_0!
    const token1Address = process.env.TOKEN_1!
    const token0MinAmount = process.env.TOKEN_0_AMOUNT_MIN!
    const token1MinAmount = process.env.TOKEN_1_AMOUNT_MIN!
    const liquidityAmount = process.env.LIQUIDITY!

    console.log('removeLiquidity# router')
    console.log('removeLiquidity# router => setting up')
    let router = new Liquidity(routerAddress, factoryAddress, privKey, rpcURL);
    console.log('removeLiquidity# router => pair')
    console.log('removeLiquidity# router => pair => fetching')
    let pair: DexPair = await router.getPair(token0Address, token1Address, privKey, rpcURL);
    console.log('removeLiquidity# router => pair => found')
    console.log('removeLiquidity# router => pair => balance')
    console.log('removeLiquidity# router => pair => balance => checking')
    let balance = await pair.balanceOf(pubKey)
    if (balance.lt(BigNumber.from((liquidityAmount)))) throw new Error('removeLiquidity# router => pair => balance => insufficient')
    else console.log('removeLiquidity# router => pair => balance => Good')
    // TODO: check pair allowance
    console.log('removeLiquidity# router => pair => allowance')
    console.log('removeLiquidity# router => pair => allowance => checking')
    let allowance = await pair.allowance(pubKey, routerAddress)
    if (allowance.lt(BigNumber.from((liquidityAmount)))) {
        console.log('removeLiquidity# router => pair => allowance => approving')
        let approveTx = await  pair.approve(routerAddress, liquidityAmount)
        console.log('removeLiquidity# router => pair => allowance => txHash: '+approveTx.hash)
        console.log('removeLiquidity# router => pair => allowance => waiting for confirmations')
        await approveTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
        console.log('removeLiquidity# router => pair => allowance => Good')
    }
    else console.log('removeLiquidity# router => pair => allowance => Good')

    console.log('removeLiquidity# router => pair => Good')
    let deadline: number = Math.floor(new Date().getTime() / 1000) + 600; // 10 minutes window
    console.log('removeLiquidity# router => transaction')
    let addTx = await router.remove(pair, liquidityAmount, token0MinAmount, token1MinAmount, deadline.toString());
    console.log('removeLiquidity# router => transaction => txHash: '+addTx.hash)
    console.log('removeLiquidity# router => waiting for confirmations')
    await addTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
    console.log('removeLiquidity# router => DONE')
    console.log('removeLiquidity# Liquidity has been removed')

})()
