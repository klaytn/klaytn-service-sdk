import { Farming } from '../core/Farming';
import { Farming as Farm, Farming__factory, DexPair, DexPair__factory, PlatformToken, PlatformToken__factory } from '../contracts';
import { Wallet, providers, ContractTransaction, BigNumber } from 'ethers';


jest.mock('../core/Farming', () => {
  return {
    Farming: jest.fn().mockImplementation(() => {
      return {
        farming: jest.fn(),
        deposit: jest.fn(() => Promise.resolve({})),
        withdraw: jest.fn(() => Promise.resolve({})),
        emergencyWithdraw: jest.fn(() => Promise.resolve({})),
        getPair: jest.fn(() => Promise.resolve({}))
      };
    }),
  };
});


describe('Farming', () => {
    let farming: Farming; 
    const farmingAddress = '0x123';
    const privKey = 'someprivkey';
    const rpcURL = 'http://localhost:8545';
  
    beforeEach(() => {
      farming = new Farming(farmingAddress, privKey, rpcURL);
    });

    it('should deposit LP token and return ContractTransaction object', async () => {
      const poolId = '1';
      const amount = '100';      
      const result = await farming.deposit(poolId, amount);

      expect(result).toBeDefined();
      expect(farming.deposit).toHaveBeenCalledWith(poolId, amount);
    });

    it('should withdraw LP token and return ContractTransaction object', async () => {
      const poolId = '1';
      const amount = '100';      
      const result = await farming.withdraw(poolId, amount);

      expect(result).toBeDefined();
      expect(farming.withdraw).toHaveBeenCalledWith(poolId, amount);
    });

    it('should emergencyWithdraw all amount and return ContractTransaction object', async () => {
      const poolId = '1';
      const result = await farming.emergencyWithdraw(poolId);

      expect(result).toBeDefined();
      expect(farming.emergencyWithdraw).toHaveBeenCalledWith(poolId);
    });

    it('should return DexPair with pairAddress', async () => {
      const result = await farming.getPair("0x123", privKey, rpcURL);;

      expect(result).toBeDefined();
      expect(farming.getPair).toHaveBeenCalledWith("0x123", privKey, rpcURL);
    });
});