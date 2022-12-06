import { DexRouter, DexRouter__factory, DexFactory, DexFactory__factory, KIP7, KIP7__factory, DexPair, DexPair__factory } from '@klaytn/dex-contracts/typechain';
import { Signer, Wallet, providers, BigNumber, ContractTransaction, Contract } from 'ethers'

export default class Liquidity {
    public router: DexRouter;
    public factory: DexFactory;

    constructor(routerAddress: string, factoryAddress: string, privKey: string, rpcURL: string) {
        this.factory = DexFactory__factory.connect(factoryAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
        this.router = DexRouter__factory.connect(routerAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    }
    public getRouter(): DexRouter { return this.router}

    public async add(tokenA: string, tokenB: string, amountADesired: number, amountBDesired: number, amountAMin: number, amountBMin: number, deadline: number): Promise<ContractTransaction> {
        const token0: KIP7 = new KIP7__factory().attach(tokenA);
        const token1: KIP7 = new KIP7__factory().attach(tokenB);
        const signerAddress: string = await this.router.signer.getAddress();
        const allowanceA: BigNumber = await token0.allowance(signerAddress,this.router.address);
        // check if tokenA allowance sufficient
        if (allowanceA.lt(BigNumber.from(amountADesired))) throw new Error('func#addLiquidity: tokenA insufficient allowance')
        const allowanceB: BigNumber = await token1.allowance(signerAddress,this.router.address);
        // check if tokenB allowance sufficient
        if (allowanceB.lt(BigNumber.from(amountBDesired))) throw new Error('func#addLiquidity: tokenB insufficient allowance')

        /*const tx: ContractTransaction = await*/ return this.router.addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, signerAddress, deadline);
    }

    public async addWithKlay(token: string, amountTokenDesired: number, amountKlayDesired: number, amountTokenMin: number, amountKlayMin: number, deadline: number): Promise<ContractTransaction> {
        const token0: KIP7 = new KIP7__factory().attach(token);
        const signerAddress: string = await this.router.signer.getAddress();
        const allowanceA: BigNumber = await token0.allowance(signerAddress,this.router.address);
        // check if tokenA allowance sufficient
        if (allowanceA.lt(BigNumber.from(amountTokenDesired))) throw new Error('func#addLiquidityWithKlay: token insufficient allowance')
        const klayBalance: BigNumber = await this.router.signer.getBalance();
        // check if tokenB allowance sufficient
        if (klayBalance.lt(BigNumber.from(amountKlayDesired))) throw new Error('func#addLiquidityWithKlay: KLAY insufficient balance')

        /*const tx: ContractTransaction = await*/ return this.router.addLiquidityKLAY(token, amountTokenDesired, amountTokenMin, amountKlayMin, signerAddress, deadline, {value: amountKlayDesired});
    }

    public async remove(pair: DexPair, liquidity: number, amountAMin: number, amountBMin: number, deadline: number): Promise<ContractTransaction> {
        const signerAddress: string = await this.router.signer.getAddress();

        const liquidityBalance = await pair.balanceOf(signerAddress)
        // check if liquidity balance sufficient
        if (liquidityBalance.lt(BigNumber.from(liquidity))) throw new Error('func#removeLiquidity: insufficient liquidity balance')

        const allowance = await pair.allowance(signerAddress, this.router.address)
        // check if liquidity allowance sufficient
        if (allowance.lt(BigNumber.from(liquidity))) throw new Error('func#removeLiquidity: insufficient liquidity allowance')
        const tokenA = await pair.token0()
        const tokenB = await pair.token1()

        /*const tx: ContractTransaction = await*/ return this.router.removeLiquidity(tokenA, tokenB, liquidity, amountAMin, amountBMin, signerAddress, deadline);
    }
    public async getPair(tokenA: string, tokenB: string, privKey: string, rpcURL: string):Promise<DexPair> {
        const pairAddress: string = await this.factory.getPair(tokenA, tokenB)
        return DexPair__factory.connect(pairAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)))
    }
    public async getAddressOfWKLAY():Promise<string> {
        return this.router.WKLAY()
    }

    public async removeWithKlay(pair: DexPair, liquidity: number, amountTokenMin: number, amountKlayMin: number, deadline: number): Promise<ContractTransaction> {
        const signerAddress: string = await this.router.signer.getAddress();

        const liquidityBalance = await pair.balanceOf(signerAddress)
        // check if liquidity balance sufficient
        if (liquidityBalance.lt(BigNumber.from(liquidity))) throw new Error('func#removeLiquidity: insufficient liquidity balance')
        const allowance = await pair.allowance(signerAddress, this.router.address)
        // check if liquidity allowance sufficient
        if (allowance.lt(BigNumber.from(liquidity))) throw new Error('func#removeLiquidity: insufficient liquidity allowance')
        const token0 = await pair.token0();
        const WKLAY = await this.getAddressOfWKLAY();
        const token = token0 !== WKLAY ? token0 : await pair.token1();

        /*const tx: ContractTransaction = await*/ return this.router.removeLiquidityKLAY(token, liquidity, amountTokenMin, amountKlayMin, signerAddress, deadline);
    }

}
