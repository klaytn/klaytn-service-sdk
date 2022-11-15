import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest
import { config } from "dotenv"
config()

import {
    getTransferObject,
    getPegConfig,
    transactor,
    getAllowance,
    checkApprove,
    approve,
    getContract,
} from "../helper"
import { getTransferConfigs } from "../APIs"
import { ethers, providers, Wallet } from "ethers"
import PeggedTokenBridgeABI from '../contract/abi/pegged/PeggedTokenBridge.sol/PeggedTokenBridge.json';
import PeggedTokenBridgeV2ABI from '../contract/abi/pegged/PeggedTokenBridgeV2.sol/PeggedTokenBridgeV2.json';

const rpc = process.env.CBRIDGE_GATEWAY_URL!
const walletAddress = process.env.WALLET_ADDRESS || ""

;(async () => {
    const transferConfigs = await getTransferConfigs(rpc)
    
    const srcChainId = parseInt(process.env.CHAIN2_ID!);
    const dstChainId = parseInt(process.env.CHAIN1_ID!);
    const tokenSymbol =  process.env.TOKEN_SYMBOL!;
    const amount = process.env.AMOUNT!;

    const peggedTokenBridgeAddress = transferConfigs.pegged_pair_configs.find(config => config.pegged_chain_id === srcChainId && config.bridge_version < 2)?.pegged_burn_contract_addr
    const peggedTokenBridge = getContract(peggedTokenBridgeAddress || '', PeggedTokenBridgeABI.abi, srcChainId)
    const peggedTokenBridgeV2Address = transferConfigs.pegged_pair_configs.find(config => config.pegged_chain_id === srcChainId && config.bridge_version === 2)?.pegged_burn_contract_addr
    const peggedTokenBridgeV2 = getContract(peggedTokenBridgeV2Address || '', PeggedTokenBridgeV2ABI.abi, srcChainId)

    const { transferToken, value, nonce } = getTransferObject(
        transferConfigs,
        srcChainId,
        dstChainId,
        tokenSymbol,
        amount
    )

    const pegConfig = getPegConfig(transferConfigs, srcChainId, dstChainId, tokenSymbol)
    const bridgeVersion = pegConfig?.bridge_version

    const spenderAddress = bridgeVersion === 2 ? peggedTokenBridgeV2Address : peggedTokenBridgeAddress
    /**Check user's on-chain token allowance for cBridge contract.
     * If the allowance is not enough for user token transfer, trigger the corresponding on-chain approve flow */
    const allowance = await getAllowance(
        walletAddress,
        spenderAddress || "",
        transferToken?.token?.address || "",
        srcChainId,
        transferToken?.token?.symbol,
        transferConfigs.pegged_pair_configs
    )
    let needToApprove = false
    needToApprove = checkApprove(allowance, amount, transferToken?.token)

    if (needToApprove) {
        const approveTx = await approve(
            spenderAddress || "",
            transferToken?.token,
            amount,
            srcChainId
        )
        if (!approveTx) {
            console.log(`Cannot approve the token`)
            return
        } else {
            needToApprove = false
        }
    }

    try {
        if (bridgeVersion === 2) {
            const transferId = ethers.utils.solidityKeccak256(
                [
                    "address",
                    "address",
                    "uint256",
                    "uint64",
                    "address",
                    "uint64",
                    "uint64",
                    "address",
                ],
                [
                    walletAddress,
                    transferToken?.token?.address,
                    amount.toString(),
                    dstChainId.toString(),
                    walletAddress,
                    nonce?.toString(),
                    pegConfig?.pegged_chain_id.toString(),
                    peggedTokenBridgeV2.address,
                ]
            )
            console.log("TransferId:", transferId)
            let result =  await transactor(
                    peggedTokenBridgeV2!.burn(
                        transferToken?.token?.address,
                        value,
                        dstChainId,
                        walletAddress,
                        nonce
                    ),
                    srcChainId
                )
            console.log(result);
        } else {
            const transferId = ethers.utils.solidityKeccak256(
                ["address", "address", "uint256", "address", "uint64", "uint64"],
                [
                    walletAddress,
                    transferToken?.token?.address,
                    amount.toString(),
                    walletAddress,
                    nonce?.toString(),
                    pegConfig?.pegged_chain_id.toString(),
                ]
            )
            console.log("TransferId:", transferId)
            let result = await transactor(
                            peggedTokenBridge!.burn(transferToken?.token?.address, value, walletAddress, nonce),
                            srcChainId
                        );
            console.log(result);
            console.log("Check the transfer status of the transaction");
        }
    } catch (error: any) {
        console.log(`-Error:`, error)
    }
})()
