import { Farming} from "../../core"
import { KIP7__factory } from '../../contracts';
import { Wallet, providers, BigNumber, constants, ContractReceipt } from 'ethers'

/**
 * A function to deposit given amount of LP token in given LP Farming pool.
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey- public key / address of account with which you want to sign the transaction.
 * @param {string} farmingAddress - Farming contract's address.
 * @param {string} depositAmount - amount of the LP KIP7 token going to be deposited.
 * @param {string} poolId - pool id in which amount is going to be deposited.
 * @return {Promise<ContractReceipt>} - ContractTransaction object.
 */
export async function deposit(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    farmingAddress: string,
    depositAmount: string,
    poolId: string,
): Promise<ContractReceipt> {
    console.log('deposit# initiating...')

    console.log('deposit# Farming => setting up')
    const farming = new Farming(farmingAddress, privKey, rpcURL);

    console.log('deposit# Farming => pool => checking')
    const pool = await farming.farming.poolInfo(poolId)
    if (pool.lpToken == constants.AddressZero) throw new Error('deposit# Farming => pool => not found')
    console.log('deposit# Farming => pool => Good')

    console.log('deposit# Farming => balance => checking')
    const lpToken = await KIP7__factory.connect(pool.lpToken, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)))
    if((await lpToken.balanceOf(pubKey)).lt(BigNumber.from(depositAmount))) throw new Error('deposit# Farming => balance => insufficient')
    console.log('deposit# Farming => balance => Good')

    console.log('deposit# Farming => allowance => checking')
    if((await lpToken.allowance(pubKey, farmingAddress)).gte(BigNumber.from(depositAmount))) {
        console.log("deposit# Farming => allowance => Good")
    } else {
        console.log('deposit# Farming => allowance => approving')
        const approvTx = await lpToken.approve(farmingAddress, depositAmount)
        console.log('deposit# Farming => allowance => txHash: '+approvTx.hash)
        console.log('deposit# Farming => allowance => waiting for confirmations')
        await approvTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
        console.log('deposit# Farming => allowance => confirmed')
        console.log('deposit# Farming => allowance => Good')
    }
    console.log('deposit# Farming => transaction => preparing')
    const depositTx = await farming.deposit(poolId, depositAmount)
    console.log('deposit# Farming => transaction => txHash: '+depositTx.hash)
    console.log('deposit# Farming => transaction => waiting for confirmations')
    const receipt = await depositTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
    console.log('deposit# Farming => transaction => confirmed')
    console.log('deposit# Farming => DONE')

    return receipt;

}
