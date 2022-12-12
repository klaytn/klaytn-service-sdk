import { Farming} from "../../services"
import { KIP7__factory, KIP7 } from '../../contracts';
import { Wallet, providers, BigNumber, constants } from 'ethers'
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('deposit# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const farmingAddress = process.env.FARMING!
    const depositAmount = process.env.AMOUNT!
    const poolId = process.env.POOL_ID!

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
    await depositTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
    console.log('deposit# Farming => transaction => confirmed')
    console.log('deposit# Farming => DONE')

})()
