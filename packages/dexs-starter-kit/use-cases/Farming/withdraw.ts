import { Farming} from "../../core"
import { BigNumber, constants, ContractReceipt } from 'ethers'

/**
 * A function to withdraw LP tokens from given LP farming pool
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey - public key / address of account with which you want to sign the transaction.
 * @param {string} farmingAddress - Farming contract's address.
 * @param {string} withdrawAmount - amount of the LP KIP7 token going to be withdrawn.
 * @param {string} poolId - pool id of LP farming pool from which amount is going to be withdrawn.
 * @param {number} confirmations - Number of blocks confirmations required to achieve to proceed per transaction.
 * @return {Promise<ContractReceipt>} - ContractTransaction object.
 */
export async function withdraw(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    farmingAddress: string,
    withdrawAmount: string,
    poolId: string,
    confirmations: number
): Promise<ContractReceipt> {
    console.log('withdraw# initiating...')

    console.log('withdraw# Farming => setting up')
    const farming = new Farming(farmingAddress, privKey, rpcURL);

    console.log('withdraw# Farming => pool => checking')
    const pool = await farming.farming.poolInfo(poolId)
    if (pool.lpToken == constants.AddressZero) throw new Error('withdraw# Farming => pool => not found')
    console.log('withdraw# Farming => pool => Good')

    console.log('withdraw# Farming => depositedBalance => checking')
    const userPool = await farming.farming.userInfo(poolId, pubKey)
    if(userPool.amount.eq(BigNumber.from(0))) throw new Error('withdraw# Farming => depositedBalance => not found')
    if(userPool.amount.lt(BigNumber.from(withdrawAmount))) throw new Error('withdraw# Farming => depositedBalance => less then the amount being withdrawn')
    console.log('withdraw# Farming => depositedBalance => Good')

    console.log('withdraw# Farming => transaction => preparing')
    const withdrawTx = await farming.withdraw(poolId, withdrawAmount)
    console.log('withdraw# Farming => transaction => txHash: '+withdrawTx.hash)
    console.log('withdraw# Farming => transaction => waiting for confirmations')
    const receipt = await withdrawTx.wait(confirmations || 6)
    console.log('withdraw# Farming => transaction => confirmed')
    console.log('withdraw# Farming => DONE')
    return receipt;
}
