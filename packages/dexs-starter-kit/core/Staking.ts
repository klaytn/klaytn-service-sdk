import { StakingInitializable, StakingInitializable__factory, KIP7, KIP7__factory, StakingFactory, StakingFactory__factory } from '../contracts';
import { Wallet, providers, ContractTransaction, BigNumber } from 'ethers'

export class Staking {
    public staking: StakingInitializable;

    constructor(routerAddress: string, privKey: string, rpcURL: string) {
        this.staking = StakingInitializable__factory.connect(routerAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    }
    /**
     * A function to initiate Staking Factory contract instance
     * @param {string} factoryAddress - address of staking factory contract.
     * @param {string} privKey - private key of signer account.
     * @param {string} rpcURL - RPC URL of blockchain provider.
     * @return {StakingFactory} - instance of staking factory contract.
     */
    public static FACTORY(factoryAddress: string, privKey: string, rpcURL: string ): StakingFactory {
        return StakingFactory__factory.connect(factoryAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    }

    /**
     * A function to deposit given amount of Staked Token in given Staking Pool contract.
     * @param {string} amount - amount of the KIP7 token (stakedToken) going to be staked.
     * @return {Promise<ContractTransaction>} - ContractTransaction object.
     */
    public async deposit(amount: string): Promise<ContractTransaction> {
        const pool = await this.staking.pool()
        const signerAddress = await this.staking.signer.getAddress()
        // check allowance
        const allowance = await KIP7__factory.connect(pool.stakedToken, this.staking.provider).allowance(signerAddress,this.staking.address)

        if( allowance.lt(BigNumber.from(amount))) throw new Error("deposit => insufficient allowance")

        return await this.staking.deposit(amount, {gasLimit: 200000});
    }

    /**
     * A function to withdraw Staked tokens from given Staking pool contract
     * @param {string} amount - amount of the Staked Token (KIP7 token) going to be withdrawn.
     * @return {Promise<ContractTransaction>} - ContractTransaction object.
     */
    public async withdraw(amount: string): Promise<ContractTransaction> {
        const signerAddress = await this.staking.signer.getAddress();
        const stakeToken: [BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber } = await this.staking.userInfo(signerAddress);

        // check/validate staked token
        if( stakeToken.amount.lt(BigNumber.from(amount))) throw new Error("withdraw => insufficient amount of tokens staked")

        return await this.staking.withdraw(amount, {gasLimit: 200000});
    }

    /**
     * A function to emergency withdraw funds from given Staking Pool contract.
     * @return {Promise<ContractTransaction>} - ContractReceipt object.
     */
    public async emergencyWithdraw(): Promise<ContractTransaction> {
        const signerAddress = await this.staking.signer.getAddress();
        const stakeToken: [BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber } = await this.staking.userInfo(signerAddress);

        // check/validate staked token
        if( stakeToken.amount.eq(0)) throw new Error("emergencyWithdraw => staked tokens not found")

        return await this.staking.emergencyWithdraw();
    }

    // administrative functions

    /**
     * A function that encodes all the details required to deploy a new Staking Pool.
     * @notice - Output of this function should be submitted to MULTISIG contract
     * @param {StakingFactory} factory - Staking Factory contract's instance.
     * @param {string} stakedTokenAddress - Address of the KIP7 token which will be staked in this Staking Pool.
     * @param {string} rewardTokenAddress - Address of the KIP7 token in which stakers will get their reward.
     * @param {string} rewardPerBlock - Number of tokens to be rewarded per block (in rewardToken)
     * @param {string} startBlock - Block number from where staking will get started.
     * @param {string} rewardEndBlock - Block number at which reward distribution will get ended.
     * @param {string} poolLimitPerUser - pool limit per user in stakedToken (if any, else 0).
     * @param {string} numberBlocksForUserLimit - block numbers available for user limit (after start block).
     * @param {string} multiSigAddress - MULTISIG contract address.
     * @return {string} - encoded raw transaction data to be submitted & executed by Multisig contract.
     */
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


    /**
     * A function that encodes all the details required to emergency withdraw funds from given staking pool contract.
     * @notice - Output of this function should be submitted to MULTISIG contract
     * @param {string} amount - amount of staked token to be withdrawn.
     * @param {string} recipient - address of recipient account to whom staked tokens should be sent.
     * @return {Promise<string>} - encoded raw transaction data to be submitted & executed by Multisig contract.
     */
    public async emergencyRewardWithdraw(amount: string, recipient: string): Promise<string> {
        return this.staking.interface.encodeFunctionData('emergencyRewardWithdraw', [amount, recipient]);
    }

    /**
     * A function that encodes all the details required to recover token (unintentionally transferred) from given staking pool contract.
     * @notice - Output of this function should be submitted to MULTISIG contract
     * @param {string} token - KIP7 token's address which is to be recovered.
     * @param {string} recipient - address of recipient account to whom recovered tokens should be sent.
     * @return {Promise<string>} - encoded raw transaction data to be submitted & executed by Multisig contract.
     */
    public async recoverToken(token: string, recipient: string): Promise<string> {
        return this.staking.interface.encodeFunctionData('recoverToken', [token, recipient]);
    }

    /**
     * A function that encodes all the details required to stop reward distribution in given staking pool contract.
     * @notice - Output of this function should be submitted to MULTISIG contract
     * @return {Promise<string>} - encoded raw transaction data to be submitted & executed by Multisig contract.
     */
    public async stopReward(): Promise<string> {
        return this.staking.interface.encodeFunctionData("stopReward");
    }

    /**
     * A function that encodes all the details required to update pool limit in given staking pool contract.
     * @notice - Output of this function should be submitted to MULTISIG contract
     * @param {boolean} userLimit - whether the limit remains forced.
     * @param {string} poolLimit - new pool limit per user.
     * @return {Promise<string>} - encoded raw transaction data to be submitted & executed by Multisig contract.
     */
    public async updatePoolLimitPerUser(userLimit: boolean, poolLimit: string): Promise<string> {
        return this.staking.interface.encodeFunctionData("updatePoolLimitPerUser", [userLimit, poolLimit]);
    }

    /**
     * A function that encodes all the details required to update reward per block in given staking pool contract.
     * @notice - Output of this function should be submitted to MULTISIG contract
     * @param {string} rewardPerBlock - new reward per block to be set.
     * @return {Promise<string>} - encoded raw transaction data to be submitted & executed by Multisig contract.
     */
    public async updateRewardPerBlock(rewardPerBlock: string): Promise<string> {
        return this.staking.interface.encodeFunctionData("updateRewardPerBlock", [rewardPerBlock]);
    }

    /**
     * A function that encodes all the details required to update start and end blocks in given staking pool contract.
     * @notice - Output of this function should be submitted to MULTISIG contract
     * @param {string} startRewardBlock - new starting reward block number.
     * @param {string} rewardEndBlock - new ending reward block number.
     * @return {Promise<string>} - encoded raw transaction data to be submitted & executed by Multisig contract.
     */
    public async updateStartAndEndBlocks(startRewardBlock: string, rewardEndBlock: string): Promise<string> {
        return this.staking.interface.encodeFunctionData("updateStartAndEndBlocks", [startRewardBlock, rewardEndBlock]);
    }

    // Getters
    /**
     * A getter function to return Staking contract's instance
     * @return {StakingInitializable} - Staking contract's instance.
     */
    public getStaking(): StakingInitializable {
        return this.staking
    }
}
