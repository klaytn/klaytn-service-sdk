import { Swap } from "../../core"
import { KIP7__factory, DexPair } from '../../contracts';
import { Wallet, providers, BigNumber, constants, ContractReceipt } from 'ethers'

/**
 * A function to swap given amount of Tokens for exact amount of Tokens.
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey- public key / address of account with which you want to sign the transaction.
 * @param {string} routerAddress - DEX SWAP Router contract's address.
 * @param {string} factoryAddress - DEX SWAP Factory contract's address.
 * @param {string[]} path - a pair of tokens addresses, path[0] should be the address of input Token & path[1] should be the address of output Token.
 * @param {string} amountIn- max amount of Tokens to be swapped.
 * @param {string} amountOut- exact amount of Tokens expecting to receive.
 * @param {string} confirmations- Number of blocks confirmations required to achieve to proceed per transaction.
 * @return {Promise<ContractReceipt>} - ContractTransaction object.
 */
export async function swapTokensForExactTokens(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    routerAddress: string,
    factoryAddress: string,
    path: string[],
    amountIn: string,
    amountOut: string,
    confirmations: number
): Promise<ContractReceipt> {
    console.log('swapTokensForExactTokens# initiating...')

    if(path.length != 2) throw new Error('swapTokensForExactTokens# invalid path');

    console.log('swapTokensForExactTokens# tokenIn')
    console.log('swapTokensForExactTokens# tokenIn => balance => checking')
    let tokenIn = KIP7__factory.connect(path[0], new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    if((await tokenIn.balanceOf(pubKey)).lt(BigNumber.from((amountIn)))){
        throw new Error("swapTokensForExactTokens# balance => tokenIn => insufficient balance")
    }
    console.log('swapTokensForExactTokens# tokenIn => balance => Good')
    console.log('swapTokensForExactTokens# tokenIn => allowance => checking')

    if((await tokenIn.allowance(pubKey, routerAddress)).gte(BigNumber.from((amountIn)))) {
        console.log('swapTokensForExactTokens# tokenIn => allowance => Good')
    }
    else {
        console.log("swapTokensForExactTokens# tokenIn => allowance => approving");
        let approveTx = await  tokenIn.approve(routerAddress, amountIn)
        console.log("swapTokensForExactTokens# tokenIn => allowance => txHash: "+approveTx.hash);
        console.log("swapTokensForExactTokens# tokenIn => allowance => waiting for confirmations");
        await approveTx.wait(confirmations || 6)
        console.log("swapTokensForExactTokens# tokenIn => allowance => DONE");
    }

    console.log('swapTokensForExactTokens# router => setting up')
    const router = new Swap(routerAddress, factoryAddress, privKey, rpcURL)
    console.log('swapTokensForExactTokens# router => pair => checking')

    const pair: DexPair = await router.getPair(path[0], path[1], privKey, rpcURL);
    if (pair.address == constants.AddressZero) throw new Error('SwapTokensForExactTokens# pair => not found');
    console.log('swapTokensForExactTokens# router => pair => found')
    console.log('swapTokensForExactTokens# router => pair => estimating price')
    const reserves = await pair.getReserves()
    const reservesSorted = await pair.token0() == path[0] ? [reserves[0], reserves[1]] : [reserves[1], reserves[0]];
    const inputAmount = await router.router.getAmountIn(amountOut, reservesSorted[0], reservesSorted[1])

    if(!inputAmount.lte(BigNumber.from((amountIn)))) throw new Error('swapTokensForExactTokens# pair => insufficient amountIn for expected amountOut')
    console.log('swapTokensForExactTokens# router => pair => Good')
    console.log('swapTokensForExactTokens# router => transaction')
    let deadline: number = Math.floor(new Date().getTime() / 1000) + 600; // 10 minutes window
    const swapTx = await router.tokensForExactTokens(amountOut, amountIn, path, deadline.toString())
    console.log('swapTokensForExactTokens# router => transaction => txHash: ' + swapTx.hash)
    const receipt = await swapTx.wait(confirmations || 6)
    console.log('swapTokensForExactTokens# router => transaction => confirmed')
    console.log('swapTokensForExactTokens# DONE')
    return receipt;
}
