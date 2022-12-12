import { Staking } from "../../services"
import { KIP7__factory, KIP7 } from '../../contracts';
import { Wallet, providers, BigNumber, constants } from 'ethers'
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('updateReward# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const stakingAddress = process.env.STAKING!
    const rewardPerBlock = process.env.REWARD_PER_BLOCK!

    console.log('updateReward# Staking => setting up')
    const staking = new Staking(stakingAddress, privKey, rpcURL);

    console.log('updateReward# Staking => Transaction => encoding')
    const rawTx = await staking.updateRewardPerBlock(rewardPerBlock)

    console.log('updateReward# Staking => Transaction => ready to submit on MultiSig')
    console.log('updateReward# Staking => Transaction => encoded data => ', rawTx)

})()
