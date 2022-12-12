import { Staking} from "../../services"
import { KIP7__factory, KIP7 } from '../../contracts';
import { Wallet, providers, BigNumber, constants } from 'ethers'
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('withdraw# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const stakingAddress = process.env.STAKING!
    const withdrawAmount = process.env.AMOUNT!

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
    await withdrawTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
    console.log('withdraw# Staking => transaction => confirmed')
    console.log('withdraw# Staking => DONE')

})()
