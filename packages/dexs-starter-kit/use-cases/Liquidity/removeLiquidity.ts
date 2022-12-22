import { Liquidity } from '../../core';
import { DexPair } from '../../contracts';
import { BigNumber, ContractReceipt } from 'ethers'

/**
 * A function to remove liquidity from a given pair of tokens (token0 & token1).
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey- public key / address of account with which you want to sign the transaction.
 * @param {string} routerAddress - DEX SWAP Router contract's address.
 * @param {string} factoryAddress - DEX SWAP Factory contract's address.
 * @param {string} token0Address - token0 a KIP7 contract's address of a given pair of tokens (whose liquidity to be removed).
 * @param {string} token1Address - token1 a KIP7 contract's address of a given pair of tokens (whose liquidity to be removed).
 * @param {string} token0MinAmount - minimum amount of the tokens of token0 want to receive.
 * @param {string} token1MinAmount - minimum amount of the tokens of token1 want to receive.
 * @param {string} liquidityAmount - amount of LP token known as liquidity which is required to be removed.
 * @param {number} confirmations - number of blocks confirmations a transaction should achieve to proceed.
 * @return {Promise<ContractReceipt>} - ContractTransaction object.
 */
export async function removeLiquidity(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    routerAddress: string,
    factoryAddress: string,
    token0Address: string,
    token1Address: string,
    token0MinAmount: string,
    token1MinAmount: string,
    liquidityAmount: string,
    confirmations: number
): Promise<ContractReceipt> {
    console.log('removeLiquidity# initiating...')


    console.log('removeLiquidity# router')
    console.log('removeLiquidity# router => setting up')
    const router = new Liquidity(routerAddress, factoryAddress, privKey, rpcURL);
    console.log('removeLiquidity# router => pair')
    console.log('removeLiquidity# router => pair => fetching')
    const pair: DexPair = await router.getPair(token0Address, token1Address, privKey, rpcURL);
    console.log('removeLiquidity# router => pair => found')
    console.log('removeLiquidity# router => pair => balance')
    console.log('removeLiquidity# router => pair => balance => checking')
    const balance = await pair.balanceOf(pubKey)
    if (balance.lt(BigNumber.from((liquidityAmount)))) throw new Error('removeLiquidity# router => pair => balance => insufficient')
    else console.log('removeLiquidity# router => pair => balance => Good')
    // TODO: check pair allowance
    console.log('removeLiquidity# router => pair => allowance')
    console.log('removeLiquidity# router => pair => allowance => checking')
    const allowance = await pair.allowance(pubKey, routerAddress)
    if (allowance.lt(BigNumber.from((liquidityAmount)))) {
        console.log('removeLiquidity# router => pair => allowance => approving')
        const approveTx = await  pair.approve(routerAddress, liquidityAmount)
        console.log('removeLiquidity# router => pair => allowance => txHash: '+approveTx.hash)
        console.log('removeLiquidity# router => pair => allowance => waiting for confirmations')
        await approveTx.wait(confirmations || 6)
        console.log('removeLiquidity# router => pair => allowance => Good')
    }
    else console.log('removeLiquidity# router => pair => allowance => Good')

    console.log('removeLiquidity# router => pair => Good')
    const deadline: number = Math.floor(new Date().getTime() / 1000) + 600; // 10 minutes window
    console.log('removeLiquidity# router => transaction')
    const addTx = await router.remove(pair, liquidityAmount, token0MinAmount, token1MinAmount, deadline.toString());
    console.log('removeLiquidity# router => transaction => txHash: '+addTx.hash)
    console.log('removeLiquidity# router => waiting for confirmations')
    const receipt = await addTx.wait(confirmations || 6)
    console.log('removeLiquidity# router => DONE')
    console.log('removeLiquidity# Liquidity has been removed')
    return receipt;
}
