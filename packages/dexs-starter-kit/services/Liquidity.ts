import { DexRouter, DexRouter__factory, DexFactory, DexFactory__factory, KIP7, KIP7__factory, DexPair, DexPair__factory } from '@klaytn/dex-contracts/typechain';
import { Signer, Wallet, providers, BigNumber, ContractTransaction, Contract } from 'ethers'

export class Liquidity {
    public router: DexRouter;
    public factory: DexFactory;

    constructor(routerAddress: string, factoryAddress: string, privKey: string, rpcURL: string) {
        this.factory = DexFactory__factory.connect(factoryAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
        this.router = DexRouter__factory.connect(routerAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    }
    public getRouter(): DexRouter { return this.router}

    public async add(token0Address: string, token1Address: string, amountADesired: string, amountBDesired: string, amountAMin: string, amountBMin: string, deadline: string): Promise<ContractTransaction> {
        const token0: KIP7 = KIP7__factory.connect(token0Address, this.router.provider);
        const token1: KIP7 = KIP7__factory.connect(token1Address, this.router.provider);
        const signerAddress: string = await this.router.signer.getAddress();
        const allowanceA: BigNumber = await token0.allowance(signerAddress,this.router.address);
        // check if token0 allowance sufficient
        if (allowanceA.lt(BigNumber.from(amountADesired))) throw new Error('addLiquidity => token0 insufficient allowance')
        const allowanceB: BigNumber = await token1.allowance(signerAddress,this.router.address);
        // check if token1 allowance sufficient
        if (allowanceB.lt(BigNumber.from(amountBDesired))) throw new Error('addLiquidity => token1 insufficient allowance')

        /*const tx: ContractTransaction = await*/ return this.router.addLiquidity(token0Address, token1Address, amountADesired, amountBDesired, amountAMin, amountBMin, signerAddress, deadline, {gasLimit: 6721975});
    }

    public async addWithKlay(token: string, amountTokenDesired: string, amountKlayDesired: string, amountTokenMin: string, amountKlayMin: string, deadline: string): Promise<ContractTransaction> {
        const token0: KIP7 = KIP7__factory.connect(token, this.router.provider);
        const signerAddress: string = await this.router.signer.getAddress();
        const allowanceA: BigNumber = await token0.allowance(signerAddress,this.router.address);
        // check if token0 allowance sufficient
        if (allowanceA.lt(BigNumber.from(amountTokenDesired))) throw new Error('addLiquidityWithKlay => token insufficient allowance')
        const klayBalance: BigNumber = await this.router.signer.getBalance();
        // check if token1 allowance sufficient
        if (klayBalance.lt(BigNumber.from(amountKlayDesired))) throw new Error('addLiquidityWithKlay => KLAY insufficient balance')

        /*const tx: ContractTransaction = await*/ return this.router.addLiquidityKLAY(token, amountTokenDesired, amountTokenMin, amountKlayMin, signerAddress, deadline, {value: amountKlayDesired});
    }

    public async remove(pair: DexPair, liquidity: string, amountAMin: string, amountBMin: string, deadline: string): Promise<ContractTransaction> {
        const signerAddress: string = await this.router.signer.getAddress();

        const liquidityBalance = await pair.balanceOf(signerAddress)
        // check if liquidity balance sufficient
        if (liquidityBalance.lt(BigNumber.from(liquidity))) throw new Error('removeLiquidity => insufficient liquidity balance')

        const allowance = await pair.allowance(signerAddress, this.router.address)
        // check if liquidity allowance sufficient
        if (allowance.lt(BigNumber.from(liquidity))) throw new Error('removeLiquidity => insufficient liquidity allowance')
        const token0 = await pair.token0()
        const token1 = await pair.token1()

        /*const tx: ContractTransaction = await*/ return this.router.removeLiquidity(token0, token1, liquidity, amountAMin, amountBMin, signerAddress, deadline);
    }

    public async removeWithKlay(pair: DexPair, liquidity: string, amountTokenMin: string, amountKlayMin: string, deadline: string): Promise<ContractTransaction> {
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

    public async getPair(token0Address: string, token1Address: string, privKey: string, rpcURL: string):Promise<DexPair> {
        const pairAddress: string = await this.factory.getPair(token0Address, token1Address)
        return DexPair__factory.connect(pairAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)))
    }
    public async getAddressOfWKLAY():Promise<string> {
        return this.router.WKLAY()
    }

}
