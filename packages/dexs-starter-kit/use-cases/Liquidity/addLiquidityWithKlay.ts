import { Liquidity } from '../../core';
import { KIP7__factory } from '../../contracts';
import { Wallet, providers, BigNumber } from 'ethers'
import { config } from 'dotenv'
config()
;(async () => {
    console.log('addLiquidityKlay# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const routerAddress = process.env.ROUTER!
    const factoryAddress = process.env.FACTORY!
    const tokenAddress = process.env.TOKEN_0!
    const tokenDesiredAmount = process.env.TOKEN_0_AMOUNT_DESIRED!
    const klayDesiredAmount = process.env.TOKEN_1_AMOUNT_DESIRED!
    const tokenMinAmount = process.env.TOKEN_0_AMOUNT_MIN!
    const klayMinAmount = process.env.TOKEN_1_AMOUNT_MIN!

    console.log('addLiquidityKLAY# balance')
    console.log('addLiquidityKLAY# balance => token => checking balance')
    let token = KIP7__factory.connect(tokenAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    if((await token.balanceOf(pubKey)).lt(BigNumber.from((tokenDesiredAmount)))){
        throw new Error("addLiquidityKLAY# balance => token => insufficient balance")
    }
    console.log('addLiquidityKLAY# balance => token => Good')
    console.log('addLiquidityKLAY# balance => KLAY => checking balance')
    let balance: BigNumber = await (new Wallet(privKey, new providers.JsonRpcProvider(rpcURL))).getBalance();
    if(balance.lt(BigNumber.from((klayDesiredAmount)))){
        throw new Error("addLiquidityKLAY# balance => KLAY => insufficient balance")
    }
    console.log('addLiquidityKLAY# balance => KLAY => Good')
    console.log('addLiquidityKLAY# balance => Good')
    console.log('addLiquidityKLAY# allowance')
    console.log('addLiquidityKLAY# allowance => token => checking allowance')


    if((await token.allowance(pubKey, routerAddress)).gte(BigNumber.from((tokenDesiredAmount)))) {
        // console.log("addLiquidityKLAY# allowance => token => already sufficient")
        console.log("addLiquidityKLAY# allowance => token => Good");
    }
    else {
        console.log("addLiquidityKLAY# allowance => token => approving");
        let approveTx = await  token.approve(routerAddress, tokenDesiredAmount)
        console.log("addLiquidityKLAY# allowance => token => waiting for confirmations of txHash: "+approveTx.hash);
        await approveTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
        console.log("addLiquidityKLAY# allowance => token => DONE");
    }

    console.log('addLiquidityKLAY# allowance => Good')
    console.log('addLiquidityKLAY# router')
    console.log('addLiquidityKLAY# router => setting up')
    let router = new Liquidity(routerAddress, factoryAddress, privKey, rpcURL);
    let deadline: number = Math.floor(new Date().getTime() / 1000) + 600; // 10 minutes window
    console.log('addLiquidityKLAY# router => transaction')
    let addTx = await router.addWithKlay(tokenAddress, tokenDesiredAmount, klayDesiredAmount, tokenMinAmount, klayMinAmount, deadline.toString());
    console.log('addLiquidityKLAY# router => transaction => txHash: '+addTx.hash)
    console.log('addLiquidityKLAY# router => waiting for confirmations')
    await addTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
    console.log('addLiquidityKLAY# router => DONE')
    console.log('addLiquidityKLAY# Liquidity has been added')

})()
