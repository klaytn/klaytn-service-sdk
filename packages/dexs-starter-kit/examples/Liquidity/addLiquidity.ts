import { Liquidity } from '../../services';
import { KIP7__factory, KIP7 } from '../../contracts';
import { Wallet, providers, BigNumber, constants } from 'ethers'
import { config } from 'dotenv'
config()
;(async () => {
    console.log('addLiquidity => initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const routerAddress = process.env.ROUTER!
    const factoryAddress = process.env.FACTORY!
    const token0Address = process.env.TOKEN_0!
    const token1Address = process.env.TOKEN_1!
    const token0DesiredAmount = process.env.TOKEN_0_AMOUNT_DESIRED!
    const token1DesiredAmount = process.env.TOKEN_1_AMOUNT_DESIRED!
    const token0MinAmount = process.env.TOKEN_0_AMOUNT_MIN!
    const token1MinAmount = process.env.TOKEN_1_AMOUNT_MIN!

    console.log('addLiquidity => balance')
    console.log('addLiquidity => balance => token0 => checking balance')
    let token0 = KIP7__factory.connect(token0Address, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    if((await token0.balanceOf(pubKey)).lt(BigNumber.from((token0DesiredAmount)))){
        throw new Error("addLiquidity => balance => token0 => insufficient balance")
    }
    console.log('addLiquidity => balance => token0 => Good')
    console.log('addLiquidity => balance => token1 => checking balance')
    let token1 = KIP7__factory.connect(token1Address, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    if((await token1.balanceOf(pubKey)).lt(BigNumber.from((token1DesiredAmount)))){
        throw new Error("addLiquidity => balance => token1 => insufficient balance")
    }
    console.log('addLiquidity => balance => token1 => Good')
    console.log('addLiquidity => balance => Good')
    console.log('addLiquidity => allowance')
    console.log('addLiquidity => allowance => token0 => checking allowance')


    if((await token0.allowance(pubKey, routerAddress)).gte(BigNumber.from((token0DesiredAmount)))) {
        // console.log("addLiquidity => allowance => token0 => already sufficient")
        console.log("addLiquidity => allowance => token0 => Good");
    }
    else {
        console.log("addLiquidity => allowance => token0 => approving");
        let approveTx = await  token0.approve(routerAddress, token0DesiredAmount)
        console.log("addLiquidity => allowance => token0 => waiting for confirmations of txHash: "+approveTx.hash);
        await approveTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
        console.log("addLiquidity => allowance => token0 => DONE");
    }

    console.log('addLiquidity => allowance => token1 => checking allowance')

    if((await token1.allowance(pubKey, routerAddress)).gte(BigNumber.from((token1DesiredAmount)))) {
        // console.log("addLiquidity => allowance => token1 => already sufficient")
        console.log("addLiquidity => allowance => token1 => Good");
    }
    else {
        console.log("addLiquidity => allowance => token1 => approving");
        let approveTx = await  token1.approve(routerAddress, token1DesiredAmount)
        console.log("addLiquidity => allowance => token1 => waiting for confirmations of txHash: "+approveTx.hash);
        await approveTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
        console.log("addLiquidity => allowance => token1 => DONE");
    }
    console.log('addLiquidity => allowance => Good')
    console.log('addLiquidity => router')
    console.log('addLiquidity => router => setting up')
    let router = new Liquidity(routerAddress, factoryAddress, privKey, rpcURL);
    let deadline: number = Math.floor(new Date().getTime() / 1000) + 600; // 10 minutes window
    console.log('addLiquidity => router => transaction')
    let addTx = await router.add(token0Address, token1Address, token0DesiredAmount, token1DesiredAmount, token0MinAmount, token1MinAmount, deadline.toString());
    console.log('addLiquidity => router => transaction => txHash: '+addTx.hash)
    console.log('addLiquidity => router => waiting for confirmations')
    await addTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
    console.log('addLiquidity => router => DONE')
    console.log('addLiquidity => Liquidity has been added')

})()
