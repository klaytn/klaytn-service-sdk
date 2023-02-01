import { Swap } from "../../core"
import { KIP7__factory, DexPair } from '../../contracts';
import { Wallet, providers, BigNumber, constants, ContractReceipt } from 'ethers'


/**
 * A function to swap exact amount of Tokens for a given amount of Tokens.
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey - public key / address of account with which you want to sign the transaction.
 * @param {string} routerAddress - DEX SWAP Router contract's address.
 * @param {string} factoryAddress - DEX SWAP Factory contract's address.
 * @param {string[]} path - a pair of tokens addresses, path[0] should be the address of input Token & path[1] should be the address of output Token.
 * @param {string} amountIn - amount of Token to be swapped.
 * @param {string} amountOut - minimum amount of Tokens expecting to receive.
 * @param {string} confirmations - Number of blocks confirmations required to achieve to proceed per transaction.
 * @return {Promise<ContractReceipt>} - ContractTransaction object.
 */
export async function swapExactTokensForTokens(
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
    console.log('swapExactTokensForTokens# initiating...')

    if(path.length != 2) throw new Error('swapExactTokensForTokens# invalid path');

    console.log('swapExactTokensForTokens# tokenIn')
    console.log('swapExactTokensForTokens# tokenIn => balance => checking')
    const tokenIn = KIP7__factory.connect(path[0], new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    if((await tokenIn.balanceOf(pubKey)).lt(BigNumber.from((amountIn)))){
        throw new Error("swapExactTokensForTokens# balance => tokenIn => insufficient balance")
    }
    console.log('swapExactTokensForTokens# tokenIn => balance => Good')
    console.log('swapExactTokensForTokens# tokenIn => allowance => checking')

    if((await tokenIn.allowance(pubKey, routerAddress)).gte(BigNumber.from((amountIn)))) {
        console.log('swapExactTokensForTokens# tokenIn => allowance => Good')
    }
    else {
        console.log("swapExactTokensForTokens# tokenIn => allowance => approving");
        const approveTx = await  tokenIn.approve(routerAddress, amountIn)
        console.log("swapExactTokensForTokens# tokenIn => allowance => txHash: "+approveTx.hash);
        console.log("swapExactTokensForTokens# tokenIn => allowance => waiting for confirmations");
        await approveTx.wait(confirmations || 6)
        console.log("swapExactTokensForTokens# tokenIn => allowance => DONE");
    }

    console.log('swapExactTokensForTokens# router => setting up')
    const router = new Swap(routerAddress, factoryAddress, privKey, rpcURL)
    console.log('swapExactTokensForTokens# router => pair => checking')

    const pair: DexPair = await router.getPair(path[0], path[1], privKey, rpcURL);
    if (pair.address == constants.AddressZero) throw new Error('SwapExactTokensForTokens# pair => not found');
    console.log('swapExactTokensForTokens# router => pair => found')
    console.log('swapExactTokensForTokens# router => pair => estimating price')
    const reserves = await pair.getReserves()
    const reservesSorted = await pair.token0() == path[0] ? [reserves[0], reserves[1]] : [reserves[1], reserves[0]];
    const outputAmount = await router.router.getAmountOut(amountIn, reservesSorted[0], reservesSorted[1])
    if(outputAmount.lt(BigNumber.from((amountOut)))) throw new Error('swapExactTokensForTokens# pair => insufficient amountIn for expected amountOut')
    console.log('swapExactTokensForTokens# router => pair => Good')
    console.log('swapExactTokensForTokens# router => transaction')
    const deadline: number = Math.floor(new Date().getTime() / 1000) + 600; // 10 minutes window
    const swapTx = await router.exactTokensForTokens(amountIn, amountOut, path, deadline.toString())
    console.log('swapExactTokensForTokens# router => transaction => txHash: ' + swapTx.hash)
    const receipt = await swapTx.wait(confirmations || 6)
    console.log('swapExactTokensForTokens# router => transaction => confirmed')
    console.log('swapExactTokensForTokens# DONE')
    return receipt;

}
