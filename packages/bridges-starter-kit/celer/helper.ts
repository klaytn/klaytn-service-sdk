import { config } from "dotenv";
config();
import { Contract,BigNumber, utils, Wallet, providers } from 'ethers';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { parseUnits } from "@ethersproject/units";
import BridgeABI from './contract/abi/Bridge.sol/Bridge.json';
import OriginalTokenVaultABI from './contract/abi/pegged/OriginalTokenVault.sol/OriginalTokenVault.json';

import { 
  GetTransferStatusRequest,
} from "./ts-proto/gateway/gateway_pb";

const bridgeInterface = new utils.Interface(BridgeABI.abi);
const originalTokenVaultInterface = new utils.Interface(OriginalTokenVaultABI.abi);

const provider = new providers.JsonRpcProvider(process.env.KLAYTN_RPC);
const signer = new Wallet(process.env.PRIVATE_KEY || '', provider);

export const transactor = async (tx) => {
  let result: TransactionResponse;
  if (tx instanceof Promise) {
    result = await tx;
  } else {
    if (!tx.gasPrice) {
      tx.gasPrice = parseUnits("4.1", "gwei");
    }
    if (!tx.gasLimit) {
      tx.gasLimit = BigNumber.from(120000);
    }
    result = await signer.sendTransaction(tx);
  }
}

export const bridge = new Contract(process.env.KLAYTN_BRIDGE_CONTRACT || '', bridgeInterface, signer);

export const originalTokenVault = new Contract(process.env.BNB_ORIGINAL_TOKEN_VAULT_CONTRACT || '', originalTokenVaultInterface, signer); //BNB originalTokenVault contract

export const getTransferId = (address, tokenAddress, value, toChainId, nonce, fromChainId) => {
  return utils.solidityKeccak256(
    ["address", "address", "address", "uint256", "uint64", "uint64", "uint64"],
    [
      address,
      address,
      tokenAddress,
      value.toString(),
      toChainId.toString(),
      nonce.toString(),
      fromChainId.toString(),
    ],
  );
}

export const getTransferStatus = async(client, transferId) => {
  const statusRequest = new GetTransferStatusRequest();
  statusRequest.setTransferId(transferId);
  const transferStatus = await client.getTransferStatus(statusRequest, null);
  console.log(`-Transfer Status:`, transferStatus.toObject());
  return transferStatus.toObject();
}

export enum NonEVMMode {
  off, // Both from and to chains are EVM
  flowTest,
  flowMainnet,
}

export const convertNonEVMAddressToEVMCompatible = async (address: string, mode: NonEVMMode) => {
  if (mode === NonEVMMode.flowMainnet || mode === NonEVMMode.flowTest) {
    const addressWithoutOx = address.toLowerCase().replace("0x", "");
    return "0x" + addressWithoutOx.padStart(40, "0");
  }
  return address;
};
