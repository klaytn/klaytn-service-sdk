import { DexRouter, DexRouter__factory, DexFactory, DexFactory__factory, KIP7, KIP7__factory, DexPair, DexPair__factory } from '../contracts';
import { Signer, Wallet, providers, BigNumber, ContractTransaction, Contract } from 'ethers'

export class Swap {
    public router: DexRouter;
    public factory: DexFactory;

    constructor(routerAddress: string, factoryAddress: string, privKey: string, rpcURL: string) {
        this.factory = DexFactory__factory.connect(factoryAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
        this.router = DexRouter__factory.connect(routerAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    }

    /**
     * A function to swap exact amount of Tokens for a given amount of Tokens.
     * @param {string[]} path - a pair of tokens addresses, path[0] should be the address of input Token & path[1] should be the address of output Token.
     * @param {string} amountIn- amount of Token to be swapped.
     * @param {string} amountDesiredOut- minimum amount of Tokens expecting to receive.
     * @param {number} deadline - UTC timestamp as deadline of this transaction, once deadline passed on-chain transaction should be reverted.
     * * @return {Promise<ContractTransaction>} - ContractTransaction object.
     */
    public async exactTokensForTokens(amountIn: string, amountDesiredOut: string, path: string[], deadline: string): Promise<ContractTransaction> {
        if (path.length < 2) throw new Error('exactTokensForTokens => path length must be at least 2');
        const inputToken: KIP7 = KIP7__factory.connect(path[0], this.router.provider);
        const signerAddress: string = await this.router.signer.getAddress();
        const allowance: BigNumber = await inputToken.allowance(signerAddress,this.router.address);
        // check if input token's allowance sufficient
        if (allowance.lt(BigNumber.from(amountIn))) throw new Error(`exactTokensForTokens => inputToken insufficient allowance`)

        /*const tx: ContractTransaction = await*/ return this.router.swapExactTokensForTokens(amountIn, amountDesiredOut, path, signerAddress, deadline);
    }

    /**
     * A function to swap given amount of Tokens for exact amount of KLAYs.
     * @param {string[]} path - a pair of tokens addresses, path[0] should be the address of Token & path[1] should be the address of WKLAY.
     * @param {string} amountDesiredMaxIn- max amount of Tokens to be swapped.
     * @param {string} amountOut- exact amount of KLAYs expecting to receive.
     * @param {number} deadline - UTC timestamp as deadline of this transaction, once deadline passed on-chain transaction should be reverted.
     * @return {Promise<ContractTransaction>} - ContractTransaction object.
     */
    public async tokensForExactTokens(amountOut: string, amountDesiredMaxIn: string, path: string[], deadline: string): Promise<ContractTransaction> {
        if (path.length < 2) throw new Error('tokensForExactTokens => path length must be at least 2');
        const inputToken: KIP7 = KIP7__factory.connect(path[0], this.router.provider);
        const signerAddress: string = await this.router.signer.getAddress();
        const allowance: BigNumber = await inputToken.allowance(signerAddress,this.router.address);
        // check if input token's allowance sufficient
        if (allowance.lt(BigNumber.from(amountDesiredMaxIn))) throw new Error(`tokensForExactTokens => inputToken insufficient allowance`)

        /*const tx: ContractTransaction = await*/ return this.router.swapTokensForExactTokens(amountOut, amountDesiredMaxIn, path, signerAddress, deadline);
    }

    /**
     * A function to swap exact amount of KLAY for a given amount of Tokens.
     * @param {string[]} path - a pair of tokens address, path[0] should be the address of WKLAY & path[1] should be the address of out Token.
     * @param {string} amountKlayIn- amount of WKLAY tokens to be swapped.
     * @param {string} amountDesiredOutMin- minimum amount of tokens expecting to receive.
     * @param {number} deadline - UTC timestamp as deadline of this transaction, once deadline passed on-chain transaction should be reverted.
     * @return {Promise<ContractTransaction>} - ContractTransaction object.
     */
    public async exactKlayForTokens(amountKlayIn: string, amountDesiredOutMin: string, path: string[], deadline: string): Promise<ContractTransaction> {
        if (path.length < 2) throw new Error('func#exactKlayForTokens: path length must be at least 2');
        // const inputToken: KIP7 = new KIP7__factory().attach(path[0]); // WKLAY no approval required as router internally wrapping KLAY into WKLAY to proceed
        const signerAddress: string = await this.router.signer.getAddress();
        const klayBalance: BigNumber = await this.router.signer.getBalance()
        // check if input token's allowance sufficient
        if (klayBalance.lt(BigNumber.from(amountKlayIn))) throw new Error(`func#tokensForExactTokens: KLAY insufficient balance`)

        /*const tx: ContractTransaction = await*/ return this.router.swapExactKLAYForTokens(amountDesiredOutMin, path, signerAddress, deadline, {value: amountKlayIn});
    }

    /**
     * A function to swap given amount of Tokens for exact amount of KLAYs.
     * @param {string[]} path - a pair of tokens addresses, path[0] should be the address of Token & path[1] should be the address of WKLAY.
     * @param {string} amountDesiredTokenMaxIn- max amount of Tokens to be swapped.
     * @param {string} amountKlayOut- exact amount of KLAYs expecting to receive.
     * @param {number} deadline - UTC timestamp as deadline of this transaction, once deadline passed on-chain transaction should be reverted.
     * @return {Promise<ContractTransaction>} - ContractTransaction object.
     */
    public async tokensForExactKlay(amountKlayOut: string, amountDesiredTokenMaxIn: string, path: string[], deadline: string): Promise<ContractTransaction> {
        if (path.length < 2) throw new Error('tokensForExactTokens => path length must be at least 2');
        const inputToken: KIP7 = KIP7__factory.connect(path[0], this.router.provider);
        const signerAddress: string = await this.router.signer.getAddress();
        const allowance: BigNumber = await inputToken.allowance(signerAddress,this.router.address);
        // check if input token's allowance sufficient
        if (allowance.lt(BigNumber.from(amountDesiredTokenMaxIn))) throw new Error(`tokensForExactTokens => inputToken insufficient allowance`)

        /*const tx: ContractTransaction = await*/ return this.router.swapTokensForExactKLAY(amountKlayOut, amountDesiredTokenMaxIn, path, signerAddress, deadline);
    }


    /**
     * A function to swap exact amount of Tokens for a given amount of KLAY.
     * @param {string[]} path - a pair of tokens addresses, path[0] should be the address of Token & path[1] should be the address of WKLAY.
     * @param {string} amountIn- amount of Token to be swapped.
     * @param {string} amountDesiredKlayOut- minimum amount of KLAYs expecting to receive.
     * @param {number} deadline - UTC timestamp as deadline of this transaction, once deadline passed on-chain transaction should be reverted.
     * @return {Promise<ContractTransaction>} - ContractTransaction object.
     */
    public async exactTokensForKlay(amountIn: string, amountDesiredKlayOut: string, path: string[], deadline: string): Promise<ContractTransaction> {
        if (path.length < 2) throw new Error('exactTokensForTokens => path length must be at least 2');
        const inputToken: KIP7 = KIP7__factory.connect(path[0], this.router.provider);
        const signerAddress: string = await this.router.signer.getAddress();
        const allowance: BigNumber = await inputToken.allowance(signerAddress,this.router.address);
        // check if input token's allowance sufficient
        if (allowance.lt(BigNumber.from(amountIn))) throw new Error(`exactTokensForTokens => inputToken insufficient allowance`)

        /*const tx: ContractTransaction = await*/ return this.router.swapExactTokensForTokens(amountIn, amountDesiredKlayOut, path, signerAddress, deadline);
    }

    /**
     * A function to swap KLAYs for a given exact amount of Tokens.
     * @param {string[]} path - a pair of tokens addresses, path[0] should be the address of WKLAY & path[1] should be the address of output Token.
     * @param {string} amountKlayIn- max amount of WKLAY to be swapped.
     * @param {string} amountDesiredOut- exact amount of Tokens expecting to receive.
     * @param {number} deadline - UTC timestamp as deadline of this transaction, once deadline passed on-chain transaction should be reverted.
     * @return {Promise<ContractTransaction>} - ContractTransaction object.
     */
    public async klayForExactTokens(amountKlayIn: string, amountDesiredOut: string, path: string[], deadline: string): Promise<ContractTransaction> {
        if (path.length < 2) throw new Error('klayForExactTokens => path length must be at least 2');
        // const inputToken: KIP7 = new KIP7__factory().attach(path[0]); // WKLAY no approval required as router internally wrapping KLAY into WKLAY to proceed
        const signerAddress: string = await this.router.signer.getAddress();
        const klayBalance: BigNumber = await this.router.signer.getBalance()
        // check if input token's allowance sufficient
        if (klayBalance.lt(BigNumber.from(amountKlayIn))) throw new Error(`klayForExactTokens => KLAY insufficient balance`)

        /*const tx: ContractTransaction = await*/ return this.router.swapKLAYForExactTokens(amountDesiredOut, path, signerAddress, deadline, {value: amountKlayIn});
    }

    // Getters
    /**
     * A getter function to return DexRouter contract's instance
     * @return {DexRouter} - DexRouter contract's instance.
     */
    public getRouter(): DexRouter { return this.router}

    /**
     * A getter function to fetch instance of DexPair contract.
     * @param {string} tokenA - Address of token0 contract.
     * @param {string} tokenB - Address of token1 contract.
     * @param {string} privKey - private key of signer account.
     * @param {string} rpcURL - RPC URL of blockchain provider.
     * @return {Promise<DexPair>} - DexPair contract's instance.
     */
    public async getPair(tokenA: string, tokenB: string, privKey: string, rpcURL: string):Promise<DexPair> {
        const pairAddress: string = await this.factory.getPair(tokenA, tokenB)
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
