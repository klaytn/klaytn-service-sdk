import { StakingInitializable, StakingInitializable__factory, KIP7__factory, StakingFactory, StakingFactory__factory } from '../contracts';
import { Wallet, providers, ContractTransaction, BigNumber } from 'ethers'
import { Staking } from '../core/Staking';


jest.mock('ethers', () => ({
    Wallet: jest.fn().mockImplementation(() => ({})),

    providers: {
      JsonRpcProvider: jest.fn().mockImplementation(() => ({}))
    }
  }))
  
jest.mock('../core/Staking', () => {
    return {
        Staking: jest.fn().mockImplementation(() => {
        return {
          FACTORY: jest.fn(),
          deposit: jest.fn(() => Promise.resolve({})),
          withdraw: jest.fn(() => Promise.resolve({})),
          emergencyWithdraw: jest.fn(() => Promise.resolve({})),
          removeWithKlay: jest.fn(() => Promise.resolve({})),
          getStaking: jest.fn(),
        };
      }),
    };
});

describe('Staking', () => {
    let staking: Staking;

    const routerAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
    const privKey = 'someprivkey';
    const rpcURL = 'http://localhost:8545';

    beforeAll(async () => {
        staking = new Staking(routerAddress, privKey, rpcURL);
    });

    it('should deposit staked token and return ContractTransaction object', async () => {
        const amount = '100';      
        const result = await staking.deposit(amount);
  
        expect(result).toBeDefined();
        expect(staking.deposit).toHaveBeenCalledWith(amount);
    });

    it('should withdraw staked token and return ContractTransaction object', async () => {
        const amount = '100';      
        const result = await staking.withdraw(amount);
  
        expect(result).toBeDefined();
        expect(staking.withdraw).toHaveBeenCalledWith(amount);
    });
  
    it('should emergencyWithdraw all amount and return ContractTransaction object', async () => {
        const result = await staking.emergencyWithdraw();
  
        expect(result).toBeDefined();
        expect(staking.emergencyWithdraw).toHaveBeenCalledWith();
    });

})