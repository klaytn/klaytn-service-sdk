// import { Farming as Farm, Farming__factory, DexPair, DexPair__factory } from '@klaytn/dex-contracts/typechain';
import { Farming as Farm, Farming__factory, DexPair, DexPair__factory, PlatformToken, PlatformToken__factory } from '../contracts';
import { Wallet, providers, ContractTransaction, BigNumber, utils } from 'ethers'

export class Farming {
    public farming: Farm;

    constructor(farmingAddress: string, privKey: string, rpcURL: string) {
        this.farming = Farming__factory.connect(farmingAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    }

    public async deposit(poolId: string, amount: string): Promise<ContractTransaction> {
        const pool = await this.farming.poolInfo(poolId);
        const signerAddress: string = await this.farming.signer.getAddress();
        let lp:DexPair = DexPair__factory.connect(pool.lpToken, this.farming.provider);
        if((await lp.balanceOf(signerAddress)).lt(BigNumber.from(amount))) throw new Error('deposit => LP balance insufficient');
        if((await lp.allowance(signerAddress, this.farming.address)).lt(BigNumber.from(amount))) throw new Error('deposit => LP allowance insufficient');
        return this.farming.deposit(poolId, amount);

    }
    public async withdraw(poolId: string, amount: string): Promise<ContractTransaction> {
        const signerAddress: string = await this.farming.signer.getAddress();
        const user: [BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber } = await this.farming.userInfo(poolId, signerAddress);
        // check if given amount is valid
        if((user.amount).lt(BigNumber.from(amount))) throw new Error('withdraw => deposited amount < withdrawing amount');
        return this.farming.withdraw(poolId, amount);

    }
    public async emergencyWithdraw(poolId: string): Promise<ContractTransaction> {
        const signerAddress: string = await this.farming.signer.getAddress();
        const user: [BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber } = await this.farming.userInfo(poolId, signerAddress);
        // check if given amount is valid
        if((user.amount).eq(BigNumber.from(0))) throw new Error('func#emergencyWithdraw deposited LP not found');

        return this.farming.emergencyWithdraw(poolId);

    }

    // administrative functions
    public async updateMultiplier(poolId: string, multiplier: string): Promise<string> {
       return  this.farming.interface.encodeFunctionData('updateMultiplier', [poolId, multiplier]);
    }
    public async updatePtnPerBlock(poolId: string): Promise<string> {
       return  this.farming.interface.encodeFunctionData('updatePtnPerBlock', [poolId]);
    }
    public async add( allocPoint: string, lpToken: string, bonusMultiplier: string, bonusEndBlock:string ): Promise<string> {
       return  this.farming.interface.encodeFunctionData('add', [ allocPoint, lpToken, bonusMultiplier, bonusEndBlock]);
    }
    public async set( allocPoint: string, poolId: string): Promise<string> {
       return  this.farming.interface.encodeFunctionData('set', [poolId, allocPoint]);
    }
    public async ptnGrantRole( ptnAddress: string): Promise<string | boolean> {
        let ptnToken: PlatformToken = PlatformToken__factory.connect(ptnAddress, this.farming.provider);
        if(await ptnToken.hasRole(await ptnToken.MINTER_ROLE(), this.farming.address))
            return false;
        else return  ptnToken.interface.encodeFunctionData('grantRole', [await ptnToken.MINTER_ROLE(), this.farming.address]);
    }

    // Getters

    public getFarm(): Farm {
        return this.farming
    }
    public async getPair(pairAddress: string, privKey: string, rpcURL: string):Promise<DexPair> {
        return DexPair__factory.connect(pairAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)))
    }
}
