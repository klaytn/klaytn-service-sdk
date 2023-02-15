import { DexRouter, DexRouter__factory, DexFactory, DexFactory__factory, KIP7, KIP7__factory, DexPair, DexPair__factory } from '../contracts';
import { Wallet, providers, BigNumber, ContractTransaction } from 'ethers'
import { Liquidity } from '../core/Liquidity';

jest.mock('ethers', () => ({
  Wallet: jest.fn().mockImplementation(() => ({})),

  providers: {
    JsonRpcProvider: jest.fn().mockImplementation(() => ({}))
  }
}))

jest.mock('../core/Liquidity', () => {
  return {
    Liquidity: jest.fn().mockImplementation(() => {
      return {
        getRouter: jest.fn(),
        add: jest.fn(() => Promise.resolve({})),
        addWithKlay: jest.fn(() => Promise.resolve({})),
        remove: jest.fn(() => Promise.resolve({})),
        removeWithKlay: jest.fn(() => Promise.resolve({})),
        getPair: jest.fn(() => Promise.resolve({})),
        getAddressOfWKLAY: jest.fn(() => Promise.resolve('0x73365f8f27de98d7634be67a167f229b32e7bf6c'))
      };
    }),
  };
});



describe('Liquidity', () => {
  let liquidity: Liquidity;
  const routerAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
  const factoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
  const token0 = '0xB8102d1eA3b3D3eCeC23A3A3c12f99B71A9006b0';
  const token1 = '0x409A221A2848a5e5eC0A1A2F70C8dC5B5C5c8684';
  const klay = '0x73365f8f27de98d7634be67a167f229b32e7bf6c';
  const privKey = 'someprivkey';
  const rpcURL = 'http://localhost:8545';
  
  beforeAll(async () => {
    liquidity = new Liquidity(routerAddress, factoryAddress, privKey, rpcURL);
  });

  describe('getRouter', () => {
    it('should return router instance', async () => {
      const router = await liquidity.getRouter();
      expect(liquidity.getRouter).toHaveBeenCalledWith();
    });
  });

  describe('add', () => {
    it('should add liquidity successfully', async () => {
      const amount0Desired = '1000000000000000000';
      const amount1Desired = '1000000000000000000';
      const amount0Min = '100000000000000000';
      const amount1Min = '100000000000000000';
      const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

      const tx = await liquidity.add(token0, token1, amount0Desired, amount1Desired, amount0Min, amount1Min, deadline.toString());
      expect(liquidity.add).toHaveBeenCalledWith(token0, token1, amount0Desired, amount1Desired, amount0Min, amount1Min, deadline.toString());
      expect(tx).toBeDefined();
    });
  });

  describe('addWithKlay', () => {
    it('should add liquidity with Klay successfully', async () => {
      const amountTokenDesired = '1000000000000000000';
      const amountKlayDesired = '1000000000000000000';
      const amountTokenMin = '100000000000000000';
      const amountKlayMin = '100000000000000000';
      const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

      const tx = await liquidity.addWithKlay(token0, amountTokenDesired, amountKlayDesired, amountTokenMin, amountKlayMin, deadline.toString());
      expect(tx).toBeDefined();
    });
  });

  describe('remove', () => {
    it('should remove liquidity from a given pair successfully', async () => {
      let pair : DexPair;
      pair = await liquidity.getPair(token0,token1,privKey,rpcURL);
      const amount0Min = '100000000000000000';
      const amount1Min = '100000000000000000';
      const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

      const tx = await liquidity.remove(pair, "10000", amount0Min, amount1Min, deadline.toString());
      expect(tx).toBeDefined();
    });

    it('should remove liquidity from a given token and klay successfully', async () => {
      let pair : DexPair;
      pair = await liquidity.getPair(token0,token1,privKey,rpcURL);
      const amount0Min = '100000000000000000';
      const amount1Min = '100000000000000000';
      const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

      const tx = await liquidity.removeWithKlay(pair, "10000", amount0Min, amount1Min, deadline.toString());
      expect(tx).toBeDefined();
    });
  });

  describe('getAddressOfWKLAY', () => {
    it('should getAddressOfWKLAY successfully', async () => {
  
      const address = await liquidity.getAddressOfWKLAY();
      expect(address).toBeDefined();
      expect(address).toEqual("0x73365f8f27de98d7634be67a167f229b32e7bf6c");
    });
  });
});
