/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IDexCallee,
  IDexCalleeInterface,
} from "../../../contracts/interfaces/IDexCallee";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "uniswapV2Call",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IDexCallee__factory {
  static readonly abi = _abi;
  static createInterface(): IDexCalleeInterface {
    return new utils.Interface(_abi) as IDexCalleeInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IDexCallee {
    return new Contract(address, _abi, signerOrProvider) as IDexCallee;
  }
}
