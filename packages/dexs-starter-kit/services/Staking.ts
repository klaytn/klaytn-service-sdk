import { StakingInitializable, StakingInitializable__factory, KIP7, KIP7__factory } from '@klaytn/dex-contracts/typechain';
import { Wallet, providers, ContractTransaction, BigNumber } from 'ethers'

export default class Staking {
    public staking: StakingInitializable;

    constructor(routerAddress: string, factoryAddress: string, privKey: string, rpcURL: string) {
        this.staking = StakingInitializable__factory.connect(routerAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    }

    public async deposit(amount: string): Promise<ContractTransaction> {
        const stakeToken = await this.staking.pool()
        const signerAddress = await this.staking.address
        // check allowance
        const allowance = await new KIP7__factory().attach(stakeToken.stakedToken).allowance(signerAddress,this.staking.address)
        if( allowance.lt(amount)) throw new Error("func#deposit insufficient allowance")

        return await this.staking.deposit(amount);
    }
    public async withdraw(amount: string): Promise<ContractTransaction> {
        const signerAddress = await this.staking.address;
        const stakeToken: [BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber } = await this.staking.userInfo(signerAddress);

        // check/validate staked token
        if( stakeToken.amount.lt(amount)) throw new Error("func#withdraw insufficient amount of tokens staked")

        return await this.staking.withdraw(amount);
    }
    public async emergencyWithdraw(): Promise<ContractTransaction> {
        const signerAddress = await this.staking.address;
        const stakeToken: [BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber } = await this.staking.userInfo(signerAddress);

        // check/validate staked token
        if( stakeToken.amount.eq(0)) throw new Error("func#emergencyWithdraw staked tokens not found")

        return await this.staking.emergencyWithdraw();
    }

    // administrative functions
    public async emergencyRewardWithdraw(amount: string, recipient: string): Promise<string> {
        return this.staking.interface.encodeFunctionData('emergencyRewardWithdraw', [amount, recipient]);
    }
    public async recoverToken(token: string, recipient: string): Promise<string> {
        return this.staking.interface.encodeFunctionData('recoverToken', [token, recipient]);
    }
    public async stopReward(): Promise<string> {
        return this.staking.interface.encodeFunctionData("stopReward");
    }
    public async updatePoolLimitPerUser(userLimit: boolean, poolLimit: string): Promise<string> {
        return this.staking.interface.encodeFunctionData("updatePoolLimitPerUser", [userLimit, poolLimit]);
    }
    public async updateRewardPerBlock(rewardPerBlock: string): Promise<string> {
        return this.staking.interface.encodeFunctionData("updateRewardPerBlock", [rewardPerBlock]);
    }
    public async updateStartAndEndBlocks(startRewardBlock: string, rewardEndBlock: string): Promise<string> {
        return this.staking.interface.encodeFunctionData("updateStartAndEndBlocks", [startRewardBlock, rewardEndBlock]);
    }

    // Getters
    public getStaking(): StakingInitializable {
        return this.staking
    }
}
