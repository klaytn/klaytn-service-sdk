import { Farming} from "../../core"
import { BigNumber, constants } from 'ethers'
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('withdraw# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const farmingAddress = process.env.FARMING!
    const withdrawAmount = process.env.AMOUNT!
    const poolId = process.env.POOL_ID!

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
    await withdrawTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
    console.log('withdraw# Farming => transaction => confirmed')
    console.log('withdraw# Farming => DONE')

})()
