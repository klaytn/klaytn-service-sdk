import { Staking } from "../../services"
import { KIP7__factory, KIP7 } from '../../contracts';
import { Wallet, providers, BigNumber, constants } from 'ethers'
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('updatePoolLimit# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const stakingAddress = process.env.STAKING!
    const userLimit = process.env.IS_USER_LIMIT! as unknown as boolean;
    const poolLimit = process.env.POOL_LIMIT_PER_USER!

    console.log('updatePoolLimit# Staking => setting up')
    const staking = new Staking(stakingAddress, privKey, rpcURL);

    console.log('updatePoolLimit# Staking => Transaction => encoding')
    const rawTx = await staking.updatePoolLimitPerUser(userLimit, poolLimit)

    console.log('updatePoolLimit# Staking => Transaction => ready to submit on MultiSig')
    console.log('updatePoolLimit# Staking => Transaction => encoded data => ', rawTx)

})()
