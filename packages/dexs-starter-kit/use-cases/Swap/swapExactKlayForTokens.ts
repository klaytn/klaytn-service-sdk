import { Swap } from "../../core"
import { DexPair } from '../../contracts';
import { Wallet, providers, BigNumber, constants, ContractReceipt } from 'ethers'

/**
 * A function to swap exact amount of KLAY for a given amount of Tokens.
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey- public key / address of account with which you want to sign the transaction.
 * @param {string} routerAddress - DEX SWAP Router contract's address.
 * @param {string} factoryAddress - DEX SWAP Factory contract's address.
 * @param {string[]} path - a pair of tokens address, path[0] should be the address of WKLAY & path[1] should be the address of out Token.
 * @param {string} amountIn- amount of WKLAY tokens to be swapped.
 * @param {string} amountOut- minimum amount of tokens expecting to receive.
 * @param {string} confirmations- Number of blocks confirmations required to achieve to proceed per transaction.
 * @return {Promise<ContractReceipt>} - ContractTransaction object.
 */
export async function swapExactKlayForTokens(
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
    console.log('swapExactKlayForTokens# initiating...')

    if(path.length != 2) throw new Error('swapExactKlayForTokens# invalid path');

    console.log('swapExactKlayForTokens# KLAY')
    console.log('swapExactKlayForTokens# KLAY => balance => checking')
    const balance: BigNumber = await (new Wallet(privKey, new providers.JsonRpcProvider(rpcURL))).getBalance();
    if(balance.lt(BigNumber.from((amountIn)))){
        throw new Error("swapExactKlayForTokens# KLAY => balance => insufficient")
    }
    console.log('swapExactKlayForTokens# KLAY => balance => Good')

    console.log('swapExactKlayForTokens# router => setting up')
    const router = new Swap(routerAddress, factoryAddress, privKey, rpcURL)
    console.log('swapExactKlayForTokens# router => pair => checking')

    if(await router.getAddressOfWKLAY() != path[0]) throw new Error('swapExactKlayForTokens# WKLAY address invalid')

    const pair: DexPair = await router.getPair(path[0], path[1], privKey, rpcURL);
    if (pair.address == constants.AddressZero) throw new Error('SwapExactKlayForTokens# pair => not found');
    console.log('swapExactKlayForTokens# router => pair => found')
    console.log('swapExactKlayForTokens# router => pair => estimating price')
    const reserves = await pair.getReserves()
    const reservesSorted = await pair.token0() == path[0] ? [reserves[0], reserves[1]] : [reserves[1], reserves[0]];
    const outputAmount = await router.router.getAmountOut(amountIn, reservesSorted[0], reservesSorted[1])

    if(!outputAmount.gte(BigNumber.from((amountOut)))) throw new Error('swapExactKlayForTokens# pair => insufficient amountIn for expected amountOut')
    console.log('swapExactKlayForTokens# router => pair => Good')
    console.log('swapExactKlayForTokens# router => transaction')
    const deadline: number = Math.floor(new Date().getTime() / 1000) + 600; // 10 minutes window
    const swapTx = await router.exactKlayForTokens(amountIn, amountOut, path, deadline.toString())
    console.log('swapExactKlayForTokens# router => transaction => txHash: ' + swapTx.hash)
    const receipt = await swapTx.wait(confirmations || 6)
    console.log('swapExactKlayForTokens# router => transaction => confirmed')
    console.log('swapExactKlayForTokens# DONE')
    return receipt;

}
