import { Liquidity } from '../../core';
import { KIP7__factory } from '../../contracts';
import { Wallet, providers, BigNumber, ContractReceipt } from 'ethers'

/**
 * A function to add liquidity with Klay to a given pair of tokens (token & Klay).
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey- public key / address of account with which you want to sign the transaction.
 * @param {string} routerAddress - DEX SWAP Router contract's address.
 * @param {string} factoryAddress - DEX SWAP Factory contract's address.
 * @param {string} tokenAddress - token a KIP7 contract's address of a given pair of tokens (whose liquidity to be added).
 * @param {string} tokenDesiredAmount - desired / max amount of the tokens of Token want to add as liquidity.
 * @param {string} klayDesiredAmount - desired / max amount of the tokens of Klay want to add as liquidity.
 * @param {string} tokenMinAmount - minimum amount of the tokens of Token want to add as liquidity.
 * @param {string} klayMinAmount - minimum amount of the tokens of Klay want to add as liquidity.
 * @param {number} confirmations - number of blocks confirmations a transaction should achieve to proceed.
 * @return {Promise<ContractReceipt>} - ContractTransaction object.
 */
export async function addLiquidityWithKlay(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    routerAddress: string,
    factoryAddress: string,
    tokenAddress: string,
    tokenDesiredAmount: string,
    klayDesiredAmount: string,
    tokenMinAmount: string,
    klayMinAmount: string,
    confirmations: number
): Promise<ContractReceipt> {
    console.log('addLiquidityKlay# initiating...')

    console.log('addLiquidityKLAY# balance')
    console.log('addLiquidityKLAY# balance => token => checking balance')
    const token = KIP7__factory.connect(tokenAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    if((await token.balanceOf(pubKey)).lt(BigNumber.from((tokenDesiredAmount)))){
        throw new Error("addLiquidityKLAY# balance => token => insufficient balance")
    }
    console.log('addLiquidityKLAY# balance => token => Good')
    console.log('addLiquidityKLAY# balance => KLAY => checking balance')
    const balance: BigNumber = await (new Wallet(privKey, new providers.JsonRpcProvider(rpcURL))).getBalance();
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
        const approveTx = await  token.approve(routerAddress, tokenDesiredAmount)
        console.log("addLiquidityKLAY# allowance => token => waiting for confirmations of txHash: "+approveTx.hash);
        await approveTx.wait(confirmations || 6)
        console.log("addLiquidityKLAY# allowance => token => DONE");
    }

    console.log('addLiquidityKLAY# allowance => Good')
    console.log('addLiquidityKLAY# router')
    console.log('addLiquidityKLAY# router => setting up')
    const router = new Liquidity(routerAddress, factoryAddress, privKey, rpcURL);
    const deadline: number = Math.floor(new Date().getTime() / 1000) + 600; // 10 minutes window
    console.log('addLiquidityKLAY# router => transaction')
    const addTx = await router.addWithKlay(tokenAddress, tokenDesiredAmount, klayDesiredAmount, tokenMinAmount, klayMinAmount, deadline.toString());
    console.log('addLiquidityKLAY# router => transaction => txHash: '+addTx.hash)
    console.log('addLiquidityKLAY# router => waiting for confirmations')
    const receipt = await addTx.wait(confirmations || 6)
    console.log('addLiquidityKLAY# router => DONE')
    console.log('addLiquidityKLAY# Liquidity has been added')
    return receipt;
}
