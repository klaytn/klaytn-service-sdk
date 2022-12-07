import { DexRouter, DexRouter__factory, DexFactory, DexFactory__factory, KIP7, KIP7__factory, DexPair, DexPair__factory } from '@klaytn/dex-contracts/typechain';
import { Wallet, providers } from 'ethers'

export class Config {
    public router: DexRouter;
    public factory: DexFactory;

    constructor(routerAddress: string, factoryAddress: string, privKey: string, rpcURL: string) {
        this.factory = DexFactory__factory.connect(factoryAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
        this.router = DexRouter__factory.connect(routerAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    }

    public getRouter(): DexRouter {
        return this.router
    }
    public async getPair(tokenA: string, tokenB: string, privKey: string, rpcURL: string):Promise<DexPair> {
        const pairAddress: string = await this.factory.getPair(tokenA, tokenB)
        return DexPair__factory.connect(pairAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)))
    }
    public async getAddressOfWKLAY():Promise<string> {
        return this.router.WKLAY()
    }
}
