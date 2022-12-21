import {
        DexRouter, DexRouter__factory,
        DexFactory, DexFactory__factory,
        DexPair, DexPair__factory,
        Farming, Farming__factory,
        StakingInitializable, StakingInitializable__factory,
        MultiSigWallet, MultiSigWallet__factory } from '../contracts';
import { Wallet, providers } from 'ethers'

export class Config {
    public router: DexRouter | undefined;
    public factory: DexFactory | undefined;
    public farming: Farming | undefined;
    public staking: StakingInitializable | undefined;
    public multiSig: MultiSigWallet | undefined;
    /**
     * A function to initialize the DEX contracts
     * @param {string} routerAddress - address of the router contract
     * @param {string} factoryAddress - address of the factory contract
     * @param {string} privKey - private key of signer
     * @param {string} rpcURL - RPC URL blockchain provider
     * @return {[DexFactory, DexRouter]} - contract instances of DexFactory & DexRouter.
     */
    public initDex(routerAddress: string, factoryAddress: string, privKey: string, rpcURL: string):[DexFactory, DexRouter] {
        this.factory = DexFactory__factory.connect(factoryAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
        this.router = DexRouter__factory.connect(routerAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
        return [this.factory, this.router];
    }

    /**
     * A getter function to fetch instance of DexPair contract.
     * @param {string} tokenA - Address of token0 contract.
     * @param {string} tokenB - Address of token1 contract.
     * @param {string} privKey - private key of signer account.
     * @param {string} rpcURL - RPC URL of blockchain provider.
     * @return {Promise<DexPair>} - DexPair contract's instance.
     */
    public async getPair(tokenA: string, tokenB: string, privKey: string, rpcURL: string):Promise<DexPair> {
        // @ts-ignore
        const pairAddress: string = await this.factory.getPair(tokenA, tokenB)
        return DexPair__factory.connect(pairAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)))
    }

    /**
     * A function to initialize instance of DexPair contract.
     * @param {string} pairAddress - address of DexPair contract.
     * @param {string} rpcURL - RPC URL of blockchain provider.
     * @return {Promise<DexPair>} - DexPair contract's instance.
     */
    public getLP(pairAddress: string, rpcURL: string):DexPair {
        return new DexPair__factory().attach(pairAddress)
    }

    /**
     * A getter function to get WKLAY contract's address
     * @return {string} - WKLAY address.
     */
    public async getAddressOfWKLAY():Promise<string> {
        // @ts-ignore
        return this.router.WKLAY()
    }

    /**
     * A function to initialize instance of Farming contract.
     * @param {string} farmAddress - address of farming contract.
     * @param {string} privKey - private key of signer.
     * @param {string} rpcURL - RPC URL of blockchain provider.
     * @return {Promise<Farming>} - Farming contract's instance.
     */
    public initFarming(farmAddress: string, privKey: string, rpcURL: string): Farming {
        return this.farming = Farming__factory.connect(farmAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    }

    /**
     * A function to initialize instance of Farming contract.
     * @param {string} stakingAddress - address of staking contract.
     * @param {string} privKey - private key of signer.
     * @param {string} rpcURL - RPC URL of blockchain provider.
     * @return {Promise<StakingInitializable>} - Staking contract's instance.
     */
    public initStaking(stakingAddress: string, privKey: string, rpcURL: string): StakingInitializable {
        return this.staking = StakingInitializable__factory.connect(stakingAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    }

    /**
     * A function to initialize instance of MultiSigWallet contract.
     * @param {string} multiSigAddress - address of MultiSigWallet contract.
     * @param {string} privKey - private key of signer.
     * @param {string} rpcURL - RPC URL of blockchain provider.
     * @return {Promise<MultiSigWallet>} - MultiSigWallet contract's instance.
     */
    public initMultiSig(multiSigAddress: string, privKey: string, rpcURL: string): MultiSigWallet {
        return this.multiSig = MultiSigWallet__factory.connect(multiSigAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    }
}
