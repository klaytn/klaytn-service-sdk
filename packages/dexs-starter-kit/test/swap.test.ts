import { Wallet, providers, BigNumber, ContractTransaction } from 'ethers'
import { DexRouter, DexRouter__factory, DexFactory, DexFactory__factory, KIP7, KIP7__factory, DexPair, DexPair__factory } from '../contracts';
import { Swap } from '../core/Swap';

jest.mock('ethers', () => ({
    Wallet: jest.fn().mockImplementation(() => ({})),
  
    providers: {
      JsonRpcProvider: jest.fn().mockImplementation(() => ({}))
    }

}))

jest.mock('../core/Swap', () => {
    return {
        Swap: jest.fn().mockImplementation(() => {
        return {
            exactTokensForTokens: jest.fn(() => Promise.resolve({})),
            tokensForExactTokens: jest.fn(() => Promise.resolve({})),
            exactKlayForTokens: jest.fn(() => Promise.resolve({})),
            tokensForExactKlay: jest.fn(() => Promise.resolve({})),
            exactTokensForKlay: jest.fn(() => Promise.resolve({})),
            klayForExactTokens: jest.fn(() => Promise.resolve({})),
        };
      }),
    };
});
  
describe('Swap', () => {
    let swap: Swap;
    const routerAddress = '0x1234567890123456789012345678901234567890';
    const factoryAddress = '0x1234567890123456789012345678901234567890';
    const privKey = '0x1234567890123456789012345678901234567890';
    const rpcURL = 'http://localhost:8545';
    

    beforeAll(() => {
        swap = new Swap(routerAddress, factoryAddress, privKey, rpcURL);
    });

    describe('exactTokensForTokens', () => {
        const path = ['0x1234567890123456789012345678901234567890', '0x2345678901234567890123456789012345678901'];
        const amountIn = '100';
        const amountDesiredOut = '200';
        const deadline = '1500000000000';

        it('should call exactTokensForTokens with correct parameters', async () => {
            const result = await swap.exactTokensForTokens(amountIn, amountDesiredOut, path, deadline)

            expect(result).toBeDefined();
            expect(swap.exactTokensForTokens).toHaveBeenCalledWith(amountIn, amountDesiredOut, path, deadline);
        })
    })

    describe('tokensForExactTokens', () => {
        const path = ['0x1234567890123456789012345678901234567890', '0x2345678901234567890123456789012345678901'];
        const amountOut = '100';
        const amountDesiredMaxIn = '200';
        const deadline = '1500000000000';

        it('should call tokensForExactTokens with correct parameters', async () => {
            const result = await swap.tokensForExactTokens(amountOut, amountDesiredMaxIn, path, deadline)

            expect(result).toBeDefined();
            expect(swap.tokensForExactTokens).toHaveBeenCalledWith(amountOut, amountDesiredMaxIn, path, deadline);
        })
    })

    describe('exactKlayForTokens', () => {
        const path = ['0x1234567890123456789012345678901234567890', '0x2345678901234567890123456789012345678901'];
        const amountKlayIn = '100';
        const amountDesiredOutMin = '200';
        const deadline = '1500000000000';

        it('should call exactKlayForTokens with correct parameters', async () => {
            const result = await swap.exactKlayForTokens(amountKlayIn, amountDesiredOutMin, path, deadline)

            expect(result).toBeDefined();
            expect(swap.exactKlayForTokens).toHaveBeenCalledWith(amountKlayIn, amountDesiredOutMin, path, deadline);
        })
    })

    describe('tokensForExactKlay', () => {
        const path = ['0x1234567890123456789012345678901234567890', '0x2345678901234567890123456789012345678901'];
        const amountKlayOut = '100';
        const amountDesiredTokenMaxIn = '200';
        const deadline = '1500000000000';

        it('should call tokensForExactKlay with correct parameters', async () => {
            const result = await swap.tokensForExactKlay(amountKlayOut, amountDesiredTokenMaxIn, path, deadline)

            expect(result).toBeDefined();
            expect(swap.tokensForExactKlay).toHaveBeenCalledWith(amountKlayOut, amountDesiredTokenMaxIn, path, deadline);
        })
    })

    describe('exactTokensForKlay', () => {
        const path = ['0x1234567890123456789012345678901234567890', '0x2345678901234567890123456789012345678901'];
        const amountIn = '100';
        const amountDesiredKlayOut = '200';
        const deadline = '1500000000000';

        it('should call tokensForExactKlay with correct parameters', async () => {
            const result = await swap.exactTokensForKlay(amountIn, amountDesiredKlayOut, path, deadline)

            expect(result).toBeDefined();
            expect(swap.exactTokensForKlay).toHaveBeenCalledWith(amountIn, amountDesiredKlayOut, path, deadline);
        })
    })

    describe('klayForExactTokens', () => {
        const path = ['0x1234567890123456789012345678901234567890', '0x2345678901234567890123456789012345678901'];
        const amountKlayIn = '100';
        const amountDesiredOut = '200';
        const deadline = '1500000000000';

        it('should call tokensForExactKlay with correct parameters', async () => {
            const result = await swap.klayForExactTokens(amountKlayIn, amountDesiredOut, path, deadline)

            expect(result).toBeDefined();
            expect(swap.klayForExactTokens).toHaveBeenCalledWith(amountKlayIn, amountDesiredOut, path, deadline);
        })
    })
})