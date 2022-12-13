import { Farming} from "../../services"
import { BigNumber, constants } from 'ethers'
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('emergencyWithdraw# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const farmingAddress = process.env.FARMING!
    const poolId = process.env.POOL_ID!

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
    await withdrawTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
    console.log('emergencyWithdraw# Farming => transaction => confirmed')
    console.log('emergencyWithdraw# Farming => DONE')

})()
