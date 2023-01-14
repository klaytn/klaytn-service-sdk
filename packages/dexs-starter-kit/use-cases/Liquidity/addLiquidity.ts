import { Liquidity } from '../../core';
import { KIP7__factory } from '../../contracts';
import { Wallet, providers, BigNumber, ContractReceipt } from 'ethers'

/**
 * A function to add liquidity to a given pair of tokens (token0 & token1).
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey- public key / address of account with which you want to sign the transaction.
 * @param {string} routerAddress - DEX SWAP Router contract's address.
 * @param {string} factoryAddress - DEX SWAP Factory contract's address.
 * @param {string} token0Address - token0 a KIP7 contract's address of a given pair of tokens (whose liquidity to be added).
 * @param {string} token1Address - token1 a KIP7 contract's address of a given pair of tokens (whose liquidity to be added).
 * @param {string} token0DesiredAmount - desired / max amount of the tokens of token0 want to add as liquidity.
 * @param {string} token1DesiredAmount - desired / max amount of the tokens of token1 want to add as liquidity.
 * @param {string} token0MinAmount - minimum amount of the tokens of token0 want to add as liquidity.
 * @param {string} token1MinAmount - minimum amount of the tokens of token1 want to add as liquidity.
 * @param {number} confirmations - number of blocks confirmations a transaction should achieve to proceed.
 * @return {Promise<ContractReceipt>} - ContractTransaction object.
 */
export async function addLiquidity(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    routerAddress: string,
    factoryAddress: string,
    token0Address: string,
    token1Address: string,
    token0DesiredAmount: string,
    token1DesiredAmount: string,
    token0MinAmount: string,
    token1MinAmount: string,
    confirmations: number
): Promise<ContractReceipt> {
    console.log('addLiquidity# initiating...')

    console.log('addLiquidity# balance')
    console.log('addLiquidity# balance => token0 => checking balance')
    const token0 = KIP7__factory.connect(token0Address, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    if((await token0.balanceOf(pubKey)).lt(BigNumber.from((token0DesiredAmount)))){
        throw new Error("addLiquidity# balance => token0 => insufficient balance")
    }
    console.log('addLiquidity# balance => token0 => Good')
    console.log('addLiquidity# balance => token1 => checking balance')
    const token1 = KIP7__factory.connect(token1Address, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    if((await token1.balanceOf(pubKey)).lt(BigNumber.from((token1DesiredAmount)))){
        throw new Error("addLiquidity# balance => token1 => insufficient balance")
    }
    console.log('addLiquidity# balance => token1 => Good')
    console.log('addLiquidity# balance => Good')
    console.log('addLiquidity# allowance')
    console.log('addLiquidity# allowance => token0 => checking allowance')


    if((await token0.allowance(pubKey, routerAddress)).gte(BigNumber.from((token0DesiredAmount)))) {
        // console.log("addLiquidity# allowance => token0 => already sufficient")
        console.log("addLiquidity# allowance => token0 => Good");
    }
    else {
        console.log("addLiquidity# allowance => token0 => approving");
        const approveTx = await  token0.approve(routerAddress, token0DesiredAmount)
        console.log("addLiquidity# allowance => token0 => waiting for confirmations of txHash: "+approveTx.hash);
        await approveTx.wait(confirmations || 6)
        console.log("addLiquidity# allowance => token0 => DONE");
    }

    console.log('addLiquidity# allowance => token1 => checking allowance')

    if((await token1.allowance(pubKey, routerAddress)).gte(BigNumber.from((token1DesiredAmount)))) {
        // console.log("addLiquidity# allowance => token1 => already sufficient")
        console.log("addLiquidity# allowance => token1 => Good");
    }
    else {
        console.log("addLiquidity# allowance => token1 => approving");
        const approveTx = await  token1.approve(routerAddress, token1DesiredAmount)
        console.log("addLiquidity# allowance => token1 => waiting for confirmations of txHash: "+approveTx.hash);
        await approveTx.wait(confirmations || 6)
        console.log("addLiquidity# allowance => token1 => DONE");
    }
    console.log('addLiquidity# allowance => Good')
    console.log('addLiquidity# router')
    console.log('addLiquidity# router => setting up')
    const router = new Liquidity(routerAddress, factoryAddress, privKey, rpcURL);
    const deadline: number = Math.floor(new Date().getTime() / 1000) + 600; // 10 minutes window
    console.log('addLiquidity# router => transaction')
    const addTx = await router.add(token0Address, token1Address, token0DesiredAmount, token1DesiredAmount, token0MinAmount, token1MinAmount, deadline.toString());
    console.log('addLiquidity# router => transaction => txHash: '+addTx.hash)
    console.log('addLiquidity# router => waiting for confirmations')
    const receipt = await addTx.wait(confirmations || 6)
    console.log('addLiquidity# router => DONE')
    console.log('addLiquidity# Liquidity has been added')
    return receipt;
}
