import { Swap } from "../../core"
import { DexPair } from '../../contracts';
import { Wallet, providers, BigNumber, constants, ContractReceipt } from 'ethers'

/**
 * A function to swap KLAYs for a given exact amount of Tokens.
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey- public key / address of account with which you want to sign the transaction.
 * @param {string} routerAddress - DEX SWAP Router contract's address.
 * @param {string} factoryAddress - DEX SWAP Factory contract's address.
 * @param {string[]} path - a pair of tokens addresses, path[0] should be the address of WKLAY & path[1] should be the address of output Token.
 * @param {string} amountIn- max amount of WKLAY to be swapped.
 * @param {string} amountOut- exact amount of Tokens expecting to receive.
 * @param {string} confirmations- Number of blocks confirmations required to achieve to proceed per transaction.
 * @return {Promise<ContractReceipt>} - ContractTransaction object.
 */
export async function swapKlayForExactTokens(
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
    console.log('swapKlayForExactTokens# initiating...')

    if(path.length != 2) throw new Error('swapKlayForExactTokens# invalid path');

    console.log('swapKlayForExactTokens# KLAY')
    console.log('swapKlayForExactTokens# KLAY => balance => checking')
    let balance: BigNumber = await (new Wallet(privKey, new providers.JsonRpcProvider(rpcURL))).getBalance();
    if(balance.lt(BigNumber.from((amountIn)))){
        throw new Error("swapKlayForExactTokens# KLAY => balance => insufficient")
    }
    console.log('swapKlayForExactTokens# KLAY => balance => Good')

    console.log('swapKlayForExactTokens# router => setting up')
    const router = new Swap(routerAddress, factoryAddress, privKey, rpcURL)
    console.log('swapKlayForExactTokens# router => pair => checking')

    if(await router.getAddressOfWKLAY() != path[0]) throw new Error('swapKlayForExactTokens# WKLAY address invalid')

    const pair: DexPair = await router.getPair(path[0], path[1], privKey, rpcURL);
    if (pair.address == constants.AddressZero) throw new Error('SwapKlayForExactTokens# pair => not found');
    console.log('swapKlayForExactTokens# router => pair => found')
    console.log('swapKlayForExactTokens# router => pair => estimating price')
    const reserves = await pair.getReserves()
    const reservesSorted = await pair.token0() == path[0] ? [reserves[0], reserves[1]] : [reserves[1], reserves[0]];
    const inputAmount = await router.router.getAmountIn(amountOut, reservesSorted[0], reservesSorted[1])
    if(!inputAmount.lte(BigNumber.from((amountIn)))) throw new Error('swapKlayForExactTokens# pair => insufficient amountIn for expected amountOut')
    console.log('swapKlayForExactTokens# router => pair => Good')
    console.log('swapKlayForExactTokens# router => transaction')
    let deadline: number = Math.floor(new Date().getTime() / 1000) + 600; // 10 minutes window
    const swapTx = await router.klayForExactTokens(amountIn, amountOut, path, deadline.toString())
    console.log('swapKlayForExactTokens# router => transaction => txHash: ' + swapTx.hash)
    const receipt = await swapTx.wait( confirmations || 6)
    console.log('swapKlayForExactTokens# router => transaction => confirmed')
    console.log('swapKlayForExactTokens# DONE')
    return receipt;

}
