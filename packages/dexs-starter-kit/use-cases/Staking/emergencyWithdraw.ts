import { Staking} from "../../core"
import { BigNumber, constants, ContractReceipt } from 'ethers'


/**
 * A function to emergency withdraw funds from given Staking Pool contract.
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey - public key / address of account with which you want to sign the transaction.
 * @param {string} stakingAddress - Staking Pool contract's address.
 * @param {string} confirmations - total block confirmations required to achieve per transaction to proceed.
 * @return {Promise<ContractReceipt>} - ContractReceipt object.
 */
export async function emergencyWithdraw(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    stakingAddress: string,
    confirmations: number
): Promise<ContractReceipt> {
    console.log('emergencyWithdraw# initiating...')

    console.log('emergencyWithdraw# Staking => setting up')
    const staking = new Staking(stakingAddress, privKey, rpcURL);

    console.log('emergencyWithdraw# Staking => pool => checking')
    const pool = await staking.staking.pool()
    if (pool.stakedToken == constants.AddressZero) throw new Error('emergencyWithdraw# Staking => pool => not found')
    console.log('emergencyWithdraw# Staking => pool => Good')

    console.log('emergencyWithdraw# Staking => stakedBalance => checking')
    const userPool = await staking.staking.userInfo(pubKey)
    if (userPool.amount.eq(BigNumber.from(0))) throw new Error('emergencyWithdraw# Staking => stakedBalance => not found')
    console.log('emergencyWithdraw# Staking => stakedBalance => Good')

    console.log('emergencyWithdraw# Staking => transaction => preparing')
    const withdrawTx = await staking.emergencyWithdraw()
    console.log('emergencyWithdraw# Staking => transaction => txHash: ' + withdrawTx.hash)
    console.log('emergencyWithdraw# Staking => transaction => waiting for confirmations')
    const receipt = await withdrawTx.wait(confirmations || 6)
    console.log('emergencyWithdraw# Staking => transaction => confirmed')
    console.log('emergencyWithdraw# Staking => DONE')
    return receipt;

}
