import { Staking} from "../../core"
import { BigNumber, constants, ContractReceipt } from 'ethers'

/**
 * A function to withdraw Staked tokens from given Staking pool contract
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey - public key / address of account with which you want to sign the transaction.
 * @param {string} stakingAddress - Staking Pool contract's address.
 * @param {string} withdrawAmount - amount of the Staked Token (KIP7 token) going to be withdrawn.
 * @param {number} confirmations - Number of blocks confirmations required to achieve to proceed per transaction.
 * @return {Promise<ContractReceipt>} - ContractTransaction object.
 */
export async function withdraw(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    stakingAddress: string,
    withdrawAmount: string,
    confirmations: number
): Promise<ContractReceipt> {
    console.log('withdraw# initiating...')

    console.log('withdraw# Staking => setting up')
    const staking = new Staking(stakingAddress, privKey, rpcURL);

    console.log('withdraw# Staking => pool => checking')
    const pool = await staking.staking.pool()
    if (pool.stakedToken == constants.AddressZero) throw new Error('withdraw# Staking => pool => not found')
    console.log('withdraw# Staking => pool => Good')

    console.log('withdraw# Staking => stakedBalance => checking')
    const userPool = await staking.staking.userInfo(pubKey)
    if(userPool.amount.eq(BigNumber.from(0))) throw new Error('withdraw# Staking => stakedBalance => not found')
    if(userPool.amount.lt(BigNumber.from(withdrawAmount))) throw new Error('withdraw# Staking => stakedBalance => less then the amount being withdrawn')
    console.log('withdraw# Staking => stakedBalance => Good')

    console.log('withdraw# Staking => transaction => preparing')
    const withdrawTx = await staking.withdraw( withdrawAmount)
    console.log('withdraw# Staking => transaction => txHash: '+withdrawTx.hash)
    console.log('withdraw# Staking => transaction => waiting for confirmations')
    const receipt = await withdrawTx.wait(confirmations || 6)
    console.log('withdraw# Staking => transaction => confirmed')
    console.log('withdraw# Staking => DONE')
    return receipt;
}
