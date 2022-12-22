import { Farming} from "../../core"
import { BigNumber, constants, ContractReceipt } from 'ethers'

/**
 * A function to emergency withdraw funds from given LP farming pool.
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey- public key / address of account with which you want to sign the transaction.
 * @param {string} farmingAddress - Farming contract's address.
 * @param {string} poolId - pool id of LP farming pool from where funds are to be withdrawn.
 * @param {number} confirmations - number of blocks confirmations requires to proceed per transaction.
 * @return {Promise<ContractReceipt>} - ContractReceipt object.
 */
export async function emergencyWithdraw(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    farmingAddress: string,
    poolId: string,
    confirmations: number
):Promise<ContractReceipt> {
    console.log('emergencyWithdraw# initiating...')

    console.log('emergencyWithdraw# Farming => setting up')
    const farming = new Farming(farmingAddress, privKey, rpcURL);

    console.log('emergencyWithdraw# Farming => pool => checking')
    const pool = await farming.farming.poolInfo(poolId)
    if (pool.lpToken == constants.AddressZero) throw new Error('emergencyWithdraw# Farming => pool => not found')
    console.log('emergencyWithdraw# Farming => pool => Good')

    console.log('emergencyWithdraw# Farming => depositedBalance => checking')
    const userPool = await farming.farming.userInfo(poolId, pubKey)
    if(userPool.amount.eq(BigNumber.from(0))) throw new Error('emergencyWithdraw# Farming => depositedBalance => not found')
    console.log('emergencyWithdraw# Farming => depositedBalance => Good')

    console.log('emergencyWithdraw# Farming => transaction => preparing')
    const withdrawTx = await farming.emergencyWithdraw(poolId)
    console.log('emergencyWithdraw# Farming => transaction => txHash: '+withdrawTx.hash)
    console.log('emergencyWithdraw# Farming => transaction => waiting for confirmations')
    const receipt = await withdrawTx.wait(confirmations || 6)
    console.log('emergencyWithdraw# Farming => transaction => confirmed')
    console.log('emergencyWithdraw# Farming => DONE')
    return receipt;
}
