import { Liquidity } from '../../core';
import { DexPair } from '../../contracts';
import { BigNumber, ContractReceipt } from 'ethers'

/**
 * A function to remove liquidity from a given pair of tokens (token & klay).
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey- public key / address of account with which you want to sign the transaction.
 * @param {string} routerAddress - DEX SWAP Router contract's address.
 * @param {string} factoryAddress - DEX SWAP Factory contract's address.
 * @param {string} tokenAddress - token a KIP7 contract's address of a given pair of tokens (whose liquidity to be removed).
 * @param {string} tokenMinAmount - minimum amount of the tokens of Token want to receive.
 * @param {string} klayMinAmount - minimum amount of the tokens of Klay want to receive.
 * @param {string} liquidityAmount - amount of LP token known as liquidity which is required to be removed.
 * @param {number} confirmations - number of blocks confirmations a transaction should achieve to proceed.
 * @return {Promise<ContractReceipt>} - ContractTransaction object.
 */
export async function removeLiquidityKlay(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    routerAddress: string,
    factoryAddress: string,
    tokenAddress: string,
    tokenMinAmount: string,
    klayMinAmount: string,
    liquidityAmount: string,
    confirmations: number
): Promise<ContractReceipt> {
    console.log('removeLiquidityKlay# initiating...')

    console.log('removeLiquidityKlay# router')
    console.log('removeLiquidityKlay# router => setting up')
    let router = new Liquidity(routerAddress, factoryAddress, privKey, rpcURL);
    let klayAddress = await router.getAddressOfWKLAY();
    console.log('removeLiquidityKlay# router => pair')
    console.log('removeLiquidityKlay# router => pair => fetching')
    let pair: DexPair = await router.getPair(tokenAddress, klayAddress, privKey, rpcURL);
    console.log('removeLiquidityKlay# router => pair => found')
    console.log('removeLiquidityKlay# router => pair => balance')
    console.log('removeLiquidityKlay# router => pair => balance => checking')
    let balance = await pair.balanceOf(pubKey)
    if (balance.lt(BigNumber.from((liquidityAmount)))) throw new Error('removeLiquidityKlay# router => pair => balance => insufficient')
    else console.log('removeLiquidityKlay# router => pair => balance => Good')

    console.log('removeLiquidityKlay# router => pair => allowance')
    console.log('removeLiquidityKlay# router => pair => allowance => checking')
    let allowance = await pair.allowance(pubKey, routerAddress)
    if (allowance.lt(BigNumber.from((liquidityAmount)))) {
        console.log('removeLiquidityKlay# router => pair => allowance => approving')
        let approveTx = await  pair.approve(routerAddress, liquidityAmount)
        console.log('removeLiquidityKlay# router => pair => allowance => txHash: '+approveTx.hash)
        console.log('removeLiquidityKlay# router => pair => allowance => waiting for confirmations')
        await approveTx.wait(confirmations || 6)
        console.log('removeLiquidityKlay# router => pair => allowance => Good')
    }
    else console.log('removeLiquidityKlay# router => pair => allowance => Good')

    console.log('removeLiquidityKlay# router => pair => Good')
    let deadline: number = Math.floor(new Date().getTime() / 1000) + 600; // 10 minutes window
    console.log('removeLiquidityKlay# router => transaction')
    let removeTx = await router.removeWithKlay(pair, liquidityAmount, tokenMinAmount, klayMinAmount, deadline.toString());
    console.log('removeLiquidityKlay# router => transaction => txHash: '+removeTx.hash)
    console.log('removeLiquidityKlay# router => waiting for confirmations')
   const receipt = await removeTx.wait(confirmations || 6)
    console.log('removeLiquidityKlay# router => DONE')
    console.log('removeLiquidityKlay# Liquidity has been removed')
    return receipt;
}
