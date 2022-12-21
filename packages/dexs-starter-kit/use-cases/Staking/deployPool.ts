import { Staking } from "../../core"
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('deployPool# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const factoryAddress = process.env.STAKING_FACTORY!
    const stakedTokenAddress = process.env.STAKED_TOKEN!
    const rewardTokenAddress = process.env.REWARD_TOKEN!
    const REWARD_PER_BLOCK = process.env.REWARD_PER_BLOCK!
    const START_BLOCK = process.env.START_BLOCK!
    const REWARD_END_BLOCK = process.env.REWARD_END_BLOCK!
    const POOL_LIMIT_PER_USER = process.env.POOL_LIMIT_PER_USER!
    const BLOCKS_FOR_USER_LIMIT = process.env.BLOCKS_FOR_USER_LIMIT!
    const multiSigAddress = process.env.MULTISIG!

    console.log('deployPool# StakingFactory => setting up')
    const StakingFactory = Staking.FACTORY(factoryAddress, privKey, rpcURL);

    console.log('deployPool# StakingFactory => Transaction => encoding')
    const rawTx = Staking.deployPool(
                    StakingFactory,
                    stakedTokenAddress,
                    rewardTokenAddress,
                    REWARD_PER_BLOCK,
                    START_BLOCK,
                    REWARD_END_BLOCK,
                    POOL_LIMIT_PER_USER,
                    BLOCKS_FOR_USER_LIMIT,
                    multiSigAddress
                );

    console.log('deployPool# StakingFactory => Transaction => ready to submit on MultiSig')
    console.log('deployPool# StakingFactory => Transaction => encoded data => ', rawTx)

})()
