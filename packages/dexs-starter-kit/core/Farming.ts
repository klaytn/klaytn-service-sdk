import { Farming as Farm, Farming__factory, DexPair, DexPair__factory, PlatformToken, PlatformToken__factory } from '../contracts';
import { Wallet, providers, ContractTransaction, BigNumber, utils } from 'ethers'

export class Farming {
    public farming: Farm;

    constructor(farmingAddress: string, privKey: string, rpcURL: string) {
        this.farming = Farming__factory.connect(farmingAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    }

    /**
     * A function to deposit given amount of LP token in given LP Farming pool.
     * @param {string} amount - amount of the LP KIP7 token going to be deposited.
     * @param {string} poolId - pool id in which amount is going to be deposited.
     * @return {Promise<ContractTransaction>} - ContractTransaction object.
     */
    public async deposit(poolId: string, amount: string): Promise<ContractTransaction> {
        const pool = await this.farming.poolInfo(poolId);
        const signerAddress: string = await this.farming.signer.getAddress();
        let lp:DexPair = DexPair__factory.connect(pool.lpToken, this.farming.provider);
        if((await lp.balanceOf(signerAddress)).lt(BigNumber.from(amount))) throw new Error('deposit => LP balance insufficient');
        if((await lp.allowance(signerAddress, this.farming.address)).lt(BigNumber.from(amount))) throw new Error('deposit => LP allowance insufficient');
        return this.farming.deposit(poolId, amount);

    }

    /**
     * A function to withdraw LP tokens from given LP farming pool
     * @param {string} amount - amount of the LP KIP7 token going to be withdrawn.
     * @param {string} poolId - pool id of LP farming pool from which amount is going to be withdrawn.
     * @return {Promise<ContractTransaction>} - ContractTransaction object.
     */
    public async withdraw(poolId: string, amount: string): Promise<ContractTransaction> {
        const signerAddress: string = await this.farming.signer.getAddress();
        const user: [BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber } = await this.farming.userInfo(poolId, signerAddress);
        // check if given amount is valid
        if((user.amount).lt(BigNumber.from(amount))) throw new Error('withdraw => deposited amount < withdrawing amount');
        return this.farming.withdraw(poolId, amount);

    }

    /**
     * A function to emergency withdraw funds from given LP farming pool.
     * @param {string} poolId - pool id of LP farming pool from where funds are to be withdrawn.
     * @return {Promise<ContractTransaction>} - ContractReceipt object.
     */
    public async emergencyWithdraw(poolId: string): Promise<ContractTransaction> {
        const signerAddress: string = await this.farming.signer.getAddress();
        const user: [BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber } = await this.farming.userInfo(poolId, signerAddress);
        // check if given amount is valid
        if((user.amount).eq(BigNumber.from(0))) throw new Error('emergencyWithdraw => deposited LP not found');

        return this.farming.emergencyWithdraw(poolId);

    }

    // administrative functions
    /**
     * A function that encodes all the details required to update bonusMultiplier of given LP farming pool.
     * @notice - Output of this function should be submitted to MULTISIG contract
     * @param {string} multiplier - Number of allocation points to be set in given farming pool.
     * @param {string} poolId - id of the LP farming pool whose bonusMultiplier to be updated.
     * @return {string} - encoded raw transaction data to be submitted & executed by Multisig contract.
     */
    public async updateMultiplier(poolId: string, multiplier: string): Promise<string> {
       return  this.farming.interface.encodeFunctionData('updateMultiplier', [poolId, multiplier]);
    }

    /**
     * A function that encodes all the details required to update rewardPerBlock of Farming contract.
     * @notice - Output of this function should be submitted to MULTISIG contract
     * @param {string} rewardPerBlock - Number of platform tokens to be given as reward per block.
     * @return {string} - encoded raw transaction data to be submitted & executed by Multisig contract.
     */
    public async updatePtnPerBlock(rewardPerBlock: string): Promise<string> {
       return  this.farming.interface.encodeFunctionData('updatePtnPerBlock', [rewardPerBlock]);
    }

    /**
     * A function that encodes all the details required to create a new LP farming pool.
     * @notice - Output of this function should be submitted to MULTISIG contract
     * @param {string} lpToken - Address of the LP KIP7 token.
     * @param {string} allocPoint - Number of allocation points for the new pool.
     * @param {string} bonusMultiplier - The pool reward multipler.
     * @param {string} bonusEndBlock - The block number after which the pool doesn't get any reward bonus from `bonusMultiplier`.
     * @return {string} - encoded raw transaction data to be submitted & executed by Multisig contract.
     */
    public async add( allocPoint: string, lpToken: string, bonusMultiplier: string, bonusEndBlock:string ): Promise<string> {
       return  this.farming.interface.encodeFunctionData('add', [ allocPoint, lpToken, bonusMultiplier, bonusEndBlock]);
    }

    /**
     * A function that encodes all the details required to update / set LP farming pool.
     * @notice - Output of this function should be submitted to MULTISIG contract
     * @param {string} allocPoint - Number of allocation points to be set in given farming pool.
     * @param {string} poolId - id of the LP farming pool whose allocPoints to be set/updated.
     * @return {string} - encoded raw transaction data to be submitted & executed by Multisig contract.
     */
    public async set( allocPoint: string, poolId: string): Promise<string> {
       return  this.farming.interface.encodeFunctionData('set', [poolId, allocPoint]);
    }


    /**
     * A function that encodes all the details required to grant minter role to Farming contract on platformToken contract.
     * @notice - Output of this function should be submitted to MULTISIG contract
     * @param {string} ptnAddress - Address of the platform token i.e: ptnToken of whom minter role to be granted to Farming contract.
     * @return {string} - encoded raw transaction data to be submitted & executed by Multisig contract.
     */
    public async ptnGrantRole( ptnAddress: string): Promise<string | boolean> {
        let ptnToken: PlatformToken = PlatformToken__factory.connect(ptnAddress, this.farming.provider);
        if(await ptnToken.hasRole(await ptnToken.MINTER_ROLE(), this.farming.address))
            return false;
        else return  ptnToken.interface.encodeFunctionData('grantRole', [await ptnToken.MINTER_ROLE(), this.farming.address]);
    }

    // Getters
    /**
     * A getter function for Farming contract's insstance
     * @return {Farm} - Farming contract's instance.
     */
    public getFarm(): Farm {
        return this.farming
    }

    /**
     * A getter function to fetch instance of DexPair contract.
     * @param {string} pairAddress - Address of DexPair contract.
     * @param {string} privKey - private key of signer account.
     * @param {string} rpcURL - RPC URL of blockchain provider.
     * @return {Promise<DexPair>} - DexPair contract's instance.
     */
    public async getPair(pairAddress: string, privKey: string, rpcURL: string):Promise<DexPair> {
        return DexPair__factory.connect(pairAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)))
    }
}
