import { Staking} from "../../core"
import { KIP7__factory } from '../../contracts';
import { Wallet, providers, BigNumber, constants } from 'ethers'
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('deposit# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const stakingAddress = process.env.STAKING!
    const depositAmount = process.env.AMOUNT!

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
        await approvTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
        console.log('deposit# Staking => allowance => confirmed')
        console.log('deposit# Staking => allowance => Good')
    }
    console.log('deposit# Staking => transaction => preparing')
    const depositTx = await staking.deposit(depositAmount)
    console.log('deposit# Staking => transaction => txHash: '+depositTx.hash)
    console.log('deposit# Staking => transaction => waiting for confirmations')
    await depositTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
    console.log('deposit# Staking => transaction => confirmed')
    console.log('deposit# Staking => DONE')

})()
