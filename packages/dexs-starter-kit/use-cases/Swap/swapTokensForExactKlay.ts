import { Swap } from "../../core"
import { KIP7__factory, DexPair } from '../../contracts';
import { Wallet, providers, BigNumber, constants, ContractReceipt } from 'ethers'

/**
 * A function to swap given amount of Tokens for exact amount of KLAYs.
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey- public key / address of account with which you want to sign the transaction.
 * @param {string} routerAddress - DEX SWAP Router contract's address.
 * @param {string} factoryAddress - DEX SWAP Factory contract's address.
 * @param {string[]} path - a pair of tokens addresses, path[0] should be the address of Token & path[1] should be the address of WKLAY.
 * @param {string} amountIn- max amount of Tokens to be swapped.
 * @param {string} amountOut- exact amount of KLAYs expecting to receive.
 * @param {string} confirmations- Number of blocks confirmations required to achieve to proceed per transaction.
 * @return {Promise<ContractReceipt>} - ContractTransaction object.
 */
export async function swapTokensForExactKlay(
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
    console.log('swapTokensForExactKlay# initiating...')

    if(path.length != 2) throw new Error('swapTokensForExactKlay# invalid path');

    console.log('swapTokensForExactKlay# tokenIn')
    console.log('swapTokensForExactKlay# tokenIn => balance => checking')
    const tokenIn = KIP7__factory.connect(path[0], new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    if((await tokenIn.balanceOf(pubKey)).lt(BigNumber.from((amountIn)))){
        throw new Error("swapTokensForExactKlay# balance => tokenIn => insufficient balance")
    }
    console.log('swapTokensForExactKlay# tokenIn => balance => Good')
    console.log('swapTokensForExactKlay# tokenIn => allowance => checking')

    if((await tokenIn.allowance(pubKey, routerAddress)).gte(BigNumber.from((amountIn)))) {
        console.log('swapTokensForExactKlay# tokenIn => allowance => Good')
    }
    else {
        console.log("swapTokensForExactKlay# tokenIn => allowance => approving");
        const approveTx = await  tokenIn.approve(routerAddress, amountIn)
        console.log("swapTokensForExactKlay# tokenIn => allowance => txHash: "+approveTx.hash);
        console.log("swapTokensForExactKlay# tokenIn => allowance => waiting for confirmations");
        await approveTx.wait(confirmations || 6)
        console.log("swapTokensForExactKlay# tokenIn => allowance => DONE");
    }

    console.log('swapTokensForExactKlay# router => setting up')
    const router = new Swap(routerAddress, factoryAddress, privKey, rpcURL)
    console.log('swapTokensForExactKlay# router => pair => checking')
    if(await router.getAddressOfWKLAY() != path[1]) throw new Error('swapExactKlayForTokens => WKLAY address invalid')

    const pair: DexPair = await router.getPair(path[0], path[1], privKey, rpcURL);
    if (pair.address == constants.AddressZero) throw new Error('SwapTokensForExactKlay# pair => not found');
    console.log('swapTokensForExactKlay# router => pair => found')
    console.log('swapTokensForExactKlay# router => pair => estimating price')
    const reserves = await pair.getReserves()
    const reservesSorted = await pair.token0() == path[0] ? [reserves[0], reserves[1]] : [reserves[1], reserves[0]];
    const inputAmount = await router.router.getAmountIn(amountOut, reservesSorted[0], reservesSorted[1])

    if(!inputAmount.lte(BigNumber.from((amountIn)))) throw new Error('swapTokensForExactKlay# pair => insufficient amountIn for expected amountOut')
    console.log('swapTokensForExactKlay# router => pair => Good')
    console.log('swapTokensForExactKlay# router => transaction')
    const deadline: number = Math.floor(new Date().getTime() / 1000) + 600; // 10 minutes window
    const swapTx = await router.tokensForExactKlay(amountOut, amountIn, path, deadline.toString())
    console.log('swapTokensForExactKlay# router => transaction => txHash: ' + swapTx.hash)
    const receipt = await swapTx.wait(confirmations || 6)
    console.log('swapTokensForExactKlay# router => transaction => confirmed')
    console.log('swapTokensForExactKlay# DONE')
    return receipt;
}
