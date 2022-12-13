import { StakingInitializable, StakingInitializable__factory, KIP7, KIP7__factory, StakingFactory, StakingFactory__factory } from '../contracts';
import { Wallet, providers, ContractTransaction, BigNumber } from 'ethers'

export class Staking {
    public staking: StakingInitializable;

    constructor(routerAddress: string, privKey: string, rpcURL: string) {
        this.staking = StakingInitializable__factory.connect(routerAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    }
    public static FACTORY(factoryAddress: string, privKey: string, rpcURL: string ): StakingFactory {
        return StakingFactory__factory.connect(factoryAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    }

    public async deposit(amount: string): Promise<ContractTransaction> {
        const pool = await this.staking.pool()
        const signerAddress = await this.staking.signer.getAddress()
        // check allowance
        const allowance = await KIP7__factory.connect(pool.stakedToken, this.staking.provider).allowance(signerAddress,this.staking.address)

        if( allowance.lt(BigNumber.from(amount))) throw new Error("deposit => insufficient allowance")

        return await this.staking.deposit(amount, {gasLimit: 200000});
    }
    public async withdraw(amount: string): Promise<ContractTransaction> {
        const signerAddress = await this.staking.signer.getAddress();
        const stakeToken: [BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber } = await this.staking.userInfo(signerAddress);

        // check/validate staked token
        if( stakeToken.amount.lt(BigNumber.from(amount))) throw new Error("withdraw => insufficient amount of tokens staked")

        return await this.staking.withdraw(amount, {gasLimit: 200000});
    }
    public async emergencyWithdraw(): Promise<ContractTransaction> {
        const signerAddress = await this.staking.signer.getAddress();
        const stakeToken: [BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber } = await this.staking.userInfo(signerAddress);

        // check/validate staked token
        if( stakeToken.amount.eq(0)) throw new Error("emergencyWithdraw => staked tokens not found")

        return await this.staking.emergencyWithdraw();
    }

    // administrative functions
    public static deployPool(factory: StakingFactory,
                            stakedTokenAddress: string,
                            rewardTokenAddress: string,
                            rewardPerBlock: string,
                            startBlock: string,
                            rewardEndBlock: string,
                            poolLimitPerUser: string,
                            numberBlocksForUserLimit: string,
                            multiSigAddress: string ): string {
        return factory.interface.encodeFunctionData(
            'deployPool',
            [
                stakedTokenAddress,
                rewardTokenAddress,
                rewardPerBlock,
                startBlock,
                rewardEndBlock,
                poolLimitPerUser,
                numberBlocksForUserLimit,
                multiSigAddress
            ]);
    }
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
