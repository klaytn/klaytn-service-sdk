import { DexRouter, DexRouter__factory, DexFactory, DexFactory__factory, KIP7, KIP7__factory, DexPair, DexPair__factory } from '../contracts';
import { Signer, Wallet, providers, BigNumber, ContractTransaction, Contract } from 'ethers'

export class Liquidity {
    public router: DexRouter;
    public factory: DexFactory;

    constructor(routerAddress: string, factoryAddress: string, privKey: string, rpcURL: string) {
        this.factory = DexFactory__factory.connect(factoryAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
        this.router = DexRouter__factory.connect(routerAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    }

    /**
     * A getter function for DEX's Router contract's instance
     * @return {DexRouter} - DexRouter contract's instance.
     */
    public getRouter(): DexRouter { return this.router}

    /**
     * A function to add liquidity to a given pair of tokens (token0 & token1).
     * @param {string} token0Address - token0 a KIP7 contract's address of a given pair of tokens (whose liquidity to be added).
     * @param {string} token1Address - token1 a KIP7 contract's address of a given pair of tokens (whose liquidity to be added).
     * @param {string} amount0Desired - desired / max amount of the tokens of token0 want to add as liquidity.
     * @param {string} amount1Desired - desired / max amount of the tokens of token1 want to add as liquidity.
     * @param {string} amount0Min - minimum amount of the tokens of token0 want to add as liquidity.
     * @param {string} amount1Min - minimum amount of the tokens of token1 want to add as liquidity.
     * @param {number} deadline - UTC timestamp as deadline of this transaction, once deadline passed on-chain transaction should be reverted.
     * @return {Promise<ContractTransaction>} - ContractTransaction object.
     */
    public async add(token0Address: string, token1Address: string, amount0Desired: string, amount1Desired: string, amount0Min: string, amount1Min: string, deadline: string): Promise<ContractTransaction> {
        const token0: KIP7 = KIP7__factory.connect(token0Address, this.router.provider);
        const token1: KIP7 = KIP7__factory.connect(token1Address, this.router.provider);
        const signerAddress: string = await this.router.signer.getAddress();
        const allowanceA: BigNumber = await token0.allowance(signerAddress,this.router.address);
        // check if token0 allowance sufficient
        if (allowanceA.lt(BigNumber.from(amount0Desired))) throw new Error('addLiquidity => token0 insufficient allowance')
        const allowanceB: BigNumber = await token1.allowance(signerAddress,this.router.address);
        // check if token1 allowance sufficient
        if (allowanceB.lt(BigNumber.from(amount1Desired))) throw new Error('addLiquidity => token1 insufficient allowance')

        /*const tx: ContractTransaction = await*/ return this.router.addLiquidity(token0Address, token1Address, amount0Desired, amount1Desired, amount0Min, amount1Min, signerAddress, deadline, {gasLimit: 6721975});
    }

    /**
     * A function to add liquidity with Klay to a given pair of tokens (token & Klay).
     * @param {string} token - token a KIP7 contract's address of a given pair of tokens (whose liquidity to be added).
     * @param {string} amountTokenDesired - desired / max amount of the tokens of Token want to add as liquidity.
     * @param {string} amountKlayDesired - desired / max amount of the tokens of Klay want to add as liquidity.
     * @param {string} amountTokenMin - minimum amount of the tokens of Token want to add as liquidity.
     * @param {string} amountKlayMin - minimum amount of the tokens of Klay want to add as liquidity.
     * @param {number} deadline - UTC timestamp as deadline of this transaction, once deadline passed on-chain transaction should be reverted.
     * @return {Promise<ContractTransaction>} - ContractTransaction object.
     */
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

    /**
     * A function to remove liquidity from a given pair of tokens (token0 & token1).
     * @param {DexPair} pair - instance of DexPair from whom liquidity to be removed.
     * @param {string} amount0Min - minimum amount of the tokens of token0 want to receive.
     * @param {string} amount1Min - minimum amount of the tokens of token1 want to receive.
     * @param {string} liquidity - amount of LP token known as liquidity which is required to be removed.
     * @param {number} deadline - UTC timestamp as deadline of this transaction, once deadline passed on-chain transaction should be reverted.
     * @return {Promise<ContractTransaction>} - ContractTransaction object.
     */
    public async remove(pair: DexPair, liquidity: string, amount0Min: string, amount1Min: string, deadline: string): Promise<ContractTransaction> {
        const signerAddress: string = await this.router.signer.getAddress();

        const liquidityBalance = await pair.balanceOf(signerAddress)
        // check if liquidity balance sufficient
        if (liquidityBalance.lt(BigNumber.from(liquidity))) throw new Error('removeLiquidity => insufficient liquidity balance')

        const allowance = await pair.allowance(signerAddress, this.router.address)
        // check if liquidity allowance sufficient
        if (allowance.lt(BigNumber.from(liquidity))) throw new Error('removeLiquidity => insufficient liquidity allowance')
        const token0 = await pair.token0()
        const token1 = await pair.token1()

        /*const tx: ContractTransaction = await*/ return this.router.removeLiquidity(token0, token1, liquidity, amount0Min, amount1Min, signerAddress, deadline);
    }

    /**
     * A function to remove liquidity from a given pair of tokens (token & klay).
     * @param {DexPair} pair - instance of DexPair from whom liquidity to be removed.
     * @param {string} amountKlayMin - minimum amount of the tokens of Klay want to receive.
     * @param {string} amountTokenMin - minimum amount of the tokens of Token want to receive.
     * @param {string} liquidity - amount of LP token known as liquidity which is required to be removed.
     * @param {number} deadline - UTC timestamp as deadline of this transaction, once deadline passed on-chain transaction should be reverted.
     * @return {Promise<ContractTransaction>} - ContractTransaction object.
     */
    public async removeWithKlay(pair: DexPair, liquidity: string, amountTokenMin: string, amountKlayMin: string, deadline: string): Promise<ContractTransaction> {
        const signerAddress: string = await this.router.signer.getAddress();

        const liquidityBalance = await pair.balanceOf(signerAddress)
        // check if liquidity balance sufficient
        if (liquidityBalance.lt(BigNumber.from(liquidity))) throw new Error('removeLiquidityKlay => insufficient liquidity balance')
        const allowance = await pair.allowance(signerAddress, this.router.address)
        // check if liquidity allowance sufficient
        if (allowance.lt(BigNumber.from(liquidity))) throw new Error('removeLiquidityKlay => insufficient liquidity allowance')
        const token0 = await pair.token0();
        const WKLAY = await this.getAddressOfWKLAY();
        const token = token0 !== WKLAY ? token0 : await pair.token1();

        /*const tx: ContractTransaction = await*/ return this.router.removeLiquidityKLAY(token, liquidity, amountTokenMin, amountKlayMin, signerAddress, deadline);
    }

    /**
     * A getter function to fetch instance of DexPair contract.
     * @param {string} token0Address - Address of token0 contract.
     * @param {string} token1Address - Address of token1 contract.
     * @param {string} privKey - private key of signer account.
     * @param {string} rpcURL - RPC URL of blockchain provider.
     * @return {Promise<DexPair>} - DexPair contract's instance.
     */
    public async getPair(token0Address: string, token1Address: string, privKey: string, rpcURL: string):Promise<DexPair> {
        const pairAddress: string = await this.factory.getPair(token0Address, token1Address)
        return DexPair__factory.connect(pairAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)))
    }

    /**
     * A getter function to get WKLAY contract's address
     * @return {string} - WKLAY address.
     */
    public async getAddressOfWKLAY():Promise<string> {
        return this.router.WKLAY()
    }

}
