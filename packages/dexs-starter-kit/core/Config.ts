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

    public initDex(routerAddress: string, factoryAddress: string, privKey: string, rpcURL: string):[DexFactory, DexRouter] {
        this.factory = DexFactory__factory.connect(factoryAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
        this.router = DexRouter__factory.connect(routerAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
        return [this.factory, this.router];
    }

    public async getPair(tokenA: string, tokenB: string, privKey: string, rpcURL: string):Promise<DexPair> {
        // @ts-ignore
        const pairAddress: string = await this.factory.getPair(tokenA, tokenB)
        return DexPair__factory.connect(pairAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)))
    }

    public getLP(pairAddress: string, rpcURL: string):DexPair {
        return new DexPair__factory().attach(pairAddress)
    }
    public async getAddressOfWKLAY():Promise<string> {
        // @ts-ignore
        return this.router.WKLAY()
    }
    public initFarming(farmAddress: string, privKey: string, rpcURL: string): Farming {
        return this.farming = Farming__factory.connect(farmAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    }
    public initStaking(stakingAddress: string, privKey: string, rpcURL: string): StakingInitializable {
        return this.staking = StakingInitializable__factory.connect(stakingAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    }
    public initMultiSig(multiSigAddress: string, privKey: string, rpcURL: string): MultiSigWallet {
        return this.multiSig = MultiSigWallet__factory.connect(multiSigAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    }
}
