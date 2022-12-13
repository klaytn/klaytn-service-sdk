import { Staking} from "../../core"
import { BigNumber, constants } from 'ethers'
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('emergencyWithdraw# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const stakingAddress = process.env.STAKING!

    console.log('emergencyWithdraw# Staking => setting up')
    const staking = new Staking(stakingAddress, privKey, rpcURL);

    console.log('emergencyWithdraw# Staking => pool => checking')
    const pool = await staking.staking.pool()
    if (pool.stakedToken == constants.AddressZero) throw new Error('emergencyWithdraw# Staking => pool => not found')
    console.log('emergencyWithdraw# Staking => pool => Good')

    console.log('emergencyWithdraw# Staking => stakedBalance => checking')
    const userPool = await staking.staking.userInfo( pubKey)
    if(userPool.amount.eq(BigNumber.from(0))) throw new Error('emergencyWithdraw# Staking => stakedBalance => not found')
    console.log('emergencyWithdraw# Staking => stakedBalance => Good')

    console.log('emergencyWithdraw# Staking => transaction => preparing')
    const withdrawTx = await staking.emergencyWithdraw()
    console.log('emergencyWithdraw# Staking => transaction => txHash: '+withdrawTx.hash)
    console.log('emergencyWithdraw# Staking => transaction => waiting for confirmations')
    await withdrawTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
    console.log('emergencyWithdraw# Staking => transaction => confirmed')
    console.log('emergencyWithdraw# Staking => DONE')

})()
