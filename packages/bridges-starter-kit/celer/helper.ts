import { config } from "dotenv";
config();
import { Contract,BigNumber, utils, Wallet, providers } from 'ethers';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { parseUnits } from "@ethersproject/units";
import BridgeABI from './contract/abi/Bridge.sol/Bridge.json';
import { 
  GetTransferStatusRequest,
} from "./ts-proto/gateway/gateway_pb";

const bridgeInterface = new utils.Interface(BridgeABI.abi);
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