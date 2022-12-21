import { Staking} from "../../core"
import { KIP7__factory } from '../../contracts';
import { Wallet, providers, BigNumber, constants, ContractReceipt } from 'ethers'

/**
 * A function to deposit given amount of Staked Token in given Staking Pool contract.
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey- public key / address of account with which you want to sign the transaction.
 * @param {string} stakingAddress - Staking Pool contract's address.
 * @param {string} depositAmount - amount of the KIP7 token (stakedToken) going to be staked.
 * @param {string} confirmations - total block confirmations required to achieve per transaction to proceed.
 * @return {Promise<ContractReceipt>} - ContractTransaction object.
 */
export async function deposit(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    stakingAddress: string,
    depositAmount: string,
    confirmations: number
): Promise<ContractReceipt> {
    console.log('deposit# initiating...')

    console.log('deposit# Staking => setting up')
    const staking = new Staking(stakingAddress, privKey, rpcURL);

    console.log('deposit# Staking => pool => checking')
    const pool = await staking.staking.pool()
    if (pool.stakedToken == constants.AddressZero) throw new Error('deposit# Staking => pool => not found')
    console.log('deposit# Staking => pool => Good')

    console.log('deposit# Staking => balance => checking')
    const stakedToken = await KIP7__factory.connect(pool.stakedToken, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)))
    if((await stakedToken.balanceOf(pubKey)).lt(BigNumber.from(depositAmount))) throw new Error('deposit# Staking => balance => insufficient')
    console.log('deposit# Staking => balance => Good')

    console.log('deposit# Staking => allowance => checking')
    const all = await stakedToken.allowance(pubKey, stakingAddress)
    if(all.gte(BigNumber.from(depositAmount))) {
        console.log("deposit# Staking => allowance => Good")
    } else {
        console.log('deposit# Staking => allowance => approving')
        const approvTx = await stakedToken.approve(stakingAddress, depositAmount)
        console.log('deposit# Staking => allowance => txHash: '+approvTx.hash)
        console.log('deposit# Staking => allowance => waiting for confirmations')
        await approvTx.wait(confirmations || 6)
        console.log('deposit# Staking => allowance => confirmed')
        console.log('deposit# Staking => allowance => Good')
    }
    console.log('deposit# Staking => transaction => preparing')
    const depositTx = await staking.deposit(depositAmount)
    console.log('deposit# Staking => transaction => txHash: '+depositTx.hash)
    console.log('deposit# Staking => transaction => waiting for confirmations')
    const receipt = await depositTx.wait(confirmations || 6)
    console.log('deposit# Staking => transaction => confirmed')
    console.log('deposit# Staking => DONE')
    return receipt;

}
