import { Swap } from "../../core"
import { KIP7__factory, DexPair } from '../../contracts';
import { Wallet, providers, BigNumber, constants, ContractReceipt } from 'ethers'

/**
 * A function to swap exact amount of Tokens for a given amount of KLAY.
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey- public key / address of account with which you want to sign the transaction.
 * @param {string} routerAddress - DEX SWAP Router contract's address.
 * @param {string} factoryAddress - DEX SWAP Factory contract's address.
 * @param {string[]} path - a pair of tokens addresses, path[0] should be the address of Token & path[1] should be the address of WKLAY.
 * @param {string} amountIn- amount of Token to be swapped.
 * @param {string} amountOut- minimum amount of KLAYs expecting to receive.
 * @param {string} confirmations- Number of blocks confirmations required to achieve to proceed per transaction.
 * @return {Promise<ContractReceipt>} - ContractTransaction object.
 */
export async function swapExactTokensForKlay(
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
    console.log('swapExactTokensForKlay# initiating...')

    if(path.length != 2) throw new Error('swapExactTokensForKlay# invalid path');

    console.log('swapExactTokensForKlay# tokenIn')
    console.log('swapExactTokensForKlay# tokenIn => balance => checking')
    const tokenIn = KIP7__factory.connect(path[0], new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    if((await tokenIn.balanceOf(pubKey)).lt(BigNumber.from((amountIn)))){
        throw new Error("swapExactTokensForKlay# balance => tokenIn => insufficient balance")
    }
    console.log('swapExactTokensForKlay# tokenIn => balance => Good')
    console.log('swapExactTokensForKlay# tokenIn => allowance => checking')

    if((await tokenIn.allowance(pubKey, routerAddress)).gte(BigNumber.from((amountIn)))) {
        console.log('swapExactTokensForKlay# tokenIn => allowance => Good')
    }
    else {
        console.log("swapExactTokensForKlay# tokenIn => allowance => approving");
        const approveTx = await  tokenIn.approve(routerAddress, amountIn)
        console.log("swapExactTokensForKlay# tokenIn => allowance => txHash: "+approveTx.hash);
        console.log("swapExactTokensForKlay# tokenIn => allowance => waiting for confirmations");
        await approveTx.wait(confirmations || 6)
        console.log("swapExactTokensForKlay# tokenIn => allowance => DONE");
    }

    console.log('swapExactTokensForKlay# router => setting up')
    const router = new Swap(routerAddress, factoryAddress, privKey, rpcURL)
    console.log('swapExactTokensForKlay# router => pair => checking')

    if(await router.getAddressOfWKLAY() != path[1]) throw new Error('swapExactTokensForKlay# WKLAY address invalid')

    const pair: DexPair = await router.getPair(path[0], path[1], privKey, rpcURL);
    if (pair.address == constants.AddressZero) throw new Error('SwapExactTokensForKlay# pair => not found');
    console.log('swapExactTokensForKlay# router => pair => found')
    console.log('swapExactTokensForKlay# router => pair => estimating price')
    const reserves = await pair.getReserves()
    const reservesSorted = await pair.token0() == path[0] ? [reserves[0], reserves[1]] : [reserves[1], reserves[0]];
    const outputAmount = await router.router.getAmountOut(amountIn, reservesSorted[0], reservesSorted[1])
    if(outputAmount.lt(BigNumber.from((amountOut)))) throw new Error('swapExactTokensForKlay# pair => insufficient amountIn for expected amountOut')
    console.log('swapExactTokensForKlay# router => pair => Good')
    console.log('swapExactTokensForKlay# router => transaction')
    const deadline: number = Math.floor(new Date().getTime() / 1000) + 600; // 10 minutes window
    const swapTx = await router.exactTokensForKlay(amountIn, amountOut, path, deadline.toString())
    console.log('swapExactTokensForKlay# router => transaction => txHash: ' + swapTx.hash)
    const recepit = await swapTx.wait(confirmations || 6)
    console.log('swapExactTokensForKlay# router => transaction => confirmed')
    console.log('swapExactTokensForKlay# DONE')
    return recepit;


}
