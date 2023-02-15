import { MultiSigWallet, MultiSigWallet__factory } from '../contracts';
import { Wallet, providers, ContractTransaction } from 'ethers';
import { MultiSig } from '../core/MultiSig';


jest.mock('ethers', () => ({
  Wallet: jest.fn().mockImplementation(() => ({})),

  providers: {
    JsonRpcProvider: jest.fn().mockImplementation(() => ({}))
  }
}))


jest.mock('../contracts', () => {
  const mockMultiSigWallet = {
      submitTransaction: jest.fn(),
      confirmAndExecuteTransaction: jest.fn(),
      revokeConfirmation: jest.fn(),
      executeTransaction: jest.fn(),
      isConfirmed: jest.fn()
  };
  return {
      MultiSigWallet: jest.fn(() => mockMultiSigWallet),
      MultiSigWallet__factory: {
          connect: jest.fn(() => mockMultiSigWallet)
      }
  };
});

describe('MultiSig', () => {
  let multiSig: MultiSig;
  const multiSigAddress = "0x1234";
  const privKey = 'someprivkey';
  const rpcURL = 'http://localhost:8545';

    beforeEach(() => {
        multiSig = new MultiSig(multiSigAddress, privKey, rpcURL);
    });

    describe('submitTransaction', () => {
      it('should call submitTransaction method on the MultiSigWallet contract', async () => {
          const destination = multiSigAddress;
          const value = '0';
          const data = '0xc6427474000000000000000000000000';
          const mockResult = {};

          (multiSig.multiSig.submitTransaction as jest.Mock).mockResolvedValue(mockResult);

          const result = await multiSig.submitTransaction(destination, value, data);

          expect(result).toEqual(mockResult);
          expect(multiSig.multiSig.submitTransaction).toHaveBeenCalledWith(destination, value, data);
      });
    });

    describe('confirmAndExecuteTransaction', () => {
      it('should call confirmAndExecuteTransaction method on the MultiSigWallet contract', async () => {
          const transactionId = '0x1234';
          const mockResult = {};

          (multiSig.multiSig.confirmAndExecuteTransaction as jest.Mock).mockResolvedValue(mockResult);

          const result = await multiSig.confirmAndExecuteTransaction(transactionId);

          expect(result).toEqual(mockResult);
          expect(multiSig.multiSig.confirmAndExecuteTransaction).toHaveBeenCalledWith(transactionId, { gasLimit: 200000 });
      });
    });

    describe('confirmAndExecuteTransaction', () => {
      it('should call revokeConfirmation method on the MultiSigWallet contract', async () => {
        const transactionId = '0x1234';
        const mockResult = {};

        (multiSig.multiSig.revokeConfirmation as jest.Mock).mockResolvedValue(mockResult);

        const result = await multiSig.revokeConfirmation(transactionId);

        expect(result).toEqual(mockResult);
        expect(multiSig.multiSig.revokeConfirmation).toHaveBeenCalled
      });
    });

    describe('isConfirmed', () => {
      it("should call isConfirmed on the MultiSigWallet contract", async () => {
        const transactionId = '0x1234';
        const mockResult = {};

        (multiSig.multiSig.isConfirmed as jest.Mock).mockResolvedValue(mockResult);

        const result = await multiSig.isConfirmed(transactionId);
        expect(result).toEqual(mockResult);
        expect(multiSig.multiSig.isConfirmed).toHaveBeenCalled
      })
    })
})