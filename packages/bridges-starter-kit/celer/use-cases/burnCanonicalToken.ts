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
    getContract, getConfirmations
} from "../core"
import { getTransferConfigs } from "../core"
import { ethers, providers, Wallet } from "ethers"
import PeggedTokenBridgeABI from '../core/contract/abi/pegged/PeggedTokenBridge.sol/PeggedTokenBridge.json';
import PeggedTokenBridgeV2ABI from '../core/contract/abi/pegged/PeggedTokenBridgeV2.sol/PeggedTokenBridgeV2.json';
import { statusTracker } from "../core"

export async function burnCanonicalToken(
    CBRIDGE_GATEWAY_URL: string,
    SRC_CHAIN_RPC: string,
    WALLET_ADDRESS: string,
    SRC_CHAIN_ID: number,
    DST_CHAIN_ID: number,
    TOKEN_SYMBOL: string,
    AMOUNT: string,
    CONFIRMATIONS: number ) {
    console.log("0. get transfer config for transaction");
    const transferConfigs = await getTransferConfigs(CBRIDGE_GATEWAY_URL)

    // check if its a valid pair transfer
    let isPairPresent = !!(transferConfigs.pegged_pair_configs.filter(chainToken =>
                        (chainToken.org_chain_id == DST_CHAIN_ID
                            && chainToken.pegged_chain_id == SRC_CHAIN_ID
                            && chainToken.pegged_token?.token?.symbol.toUpperCase() == TOKEN_SYMBOL
                        )).length > 0);

    if(!isPairPresent) {
        throw new Error("Please choose valid pairs");
    }

    const peggedTokenBridgeAddress = transferConfigs.pegged_pair_configs.find(config => config.pegged_chain_id === SRC_CHAIN_ID && config.bridge_version < 2)?.pegged_burn_contract_addr
    const peggedTokenBridge = getContract(peggedTokenBridgeAddress || '', PeggedTokenBridgeABI.abi, SRC_CHAIN_ID)
    const peggedTokenBridgeV2Address = transferConfigs.pegged_pair_configs.find(config => config.pegged_chain_id === SRC_CHAIN_ID && config.bridge_version === 2)?.pegged_burn_contract_addr
    const peggedTokenBridgeV2 = getContract(peggedTokenBridgeV2Address || '', PeggedTokenBridgeV2ABI.abi, SRC_CHAIN_ID)

    const { transferToken, value, nonce } = getTransferObject(
        transferConfigs,
        SRC_CHAIN_ID,
        DST_CHAIN_ID,
        TOKEN_SYMBOL,
        AMOUNT
    )

    const pegConfig = getPegConfig(transferConfigs, SRC_CHAIN_ID, DST_CHAIN_ID, TOKEN_SYMBOL)
    const bridgeVersion = pegConfig?.bridge_version

    const spenderAddress = bridgeVersion === 2 ? peggedTokenBridgeV2Address : peggedTokenBridgeAddress
    /**Check user's on-chain token allowance for peggedtoken contract.
     * If the allowance is not enough for user token transfer, trigger the corresponding on-chain approve flow */
    console.log("1. Checking Allowance of tokens to PeggedToken contract");
    const allowance = await getAllowance(
        WALLET_ADDRESS,
        spenderAddress || "",
        transferToken?.token?.address || "",
        SRC_CHAIN_ID,
        transferToken?.token?.symbol,
        transferConfigs.pegged_pair_configs
    )
    let needToApprove = false;
    let isNative = transferConfigs.chains.filter(chain =>
        (chain.id == SRC_CHAIN_ID && chain.gas_token_symbol.toUpperCase() == TOKEN_SYMBOL.toUpperCase())).length > 0;
    needToApprove = checkApprove(allowance, AMOUNT, transferToken?.token, isNative)

    if (needToApprove) {
        console.log("Approving the tokens");
        const approveTx = await approve(
            spenderAddress || "",
            transferToken?.token,
            AMOUNT,
            SRC_CHAIN_ID
        )
        if (!approveTx) {
            console.log(`Cannot approve the token`)
            return
        } else {
            needToApprove = false
        }
        console.log("approveTx hash: " + approveTx.hash);
        console.log("Waiting for the confirmations of approveTx");
        const confirmationReceipt = await getConfirmations(approveTx.hash, CONFIRMATIONS, SRC_CHAIN_RPC); // instead of waiting for fixed time, wait for some confirmations
        console.log(`approveTx confirmed upto ${confirmationReceipt.confirmations} confirmations`);
    }

    try {
        if (bridgeVersion === 2) {
            const burnId = ethers.utils.solidityKeccak256(
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
                    WALLET_ADDRESS,
                    transferToken?.token?.address,
                    value?.toString(),
                    DST_CHAIN_ID.toString(),
                    WALLET_ADDRESS,
                    nonce?.toString(),
                    pegConfig?.pegged_chain_id.toString(),
                    peggedTokenBridgeV2.address,
                ]
            )
            console.log("burnId:", burnId)
            console.log("3. submit an on-chain send transaction");
            let burnTx =  await transactor(
                    peggedTokenBridgeV2!.burn(
                        transferToken?.token?.address,
                        value,
                        DST_CHAIN_ID,
                        WALLET_ADDRESS,
                        nonce,
                        {gasLimit: 200000 }
                    ),
                    SRC_CHAIN_ID
                )
            // TODO: should if tx was passed or failed (logically)
            console.log("burnTx hash: " + burnTx.hash);
            console.log("Waiting for the confirmations of burnTx");
            const confirmationReceipt = await getConfirmations(burnTx.hash, CONFIRMATIONS, SRC_CHAIN_RPC); // instead of waiting for fixed time, wait for some confirmations
            console.log(`burnTx confirmed upto ${confirmationReceipt.confirmations} confirmations`);
            console.log("4. getTransferStatus for this transaction until the transfer is complete or needs a refund");
            statusTracker(CBRIDGE_GATEWAY_URL, burnId)
        } else {
            const burnId = ethers.utils.solidityKeccak256(
                ["address", "address", "uint256", "address", "uint64", "uint64"],
                [
                    WALLET_ADDRESS,
                    transferToken?.token?.address,
                    value?.toString(),
                    WALLET_ADDRESS,
                    nonce?.toString(),
                    pegConfig?.pegged_chain_id.toString(),
                ]
            )
            console.log("burnId:", burnId)
            console.log("3. submit an on-chain send transaction");
            let burnTx = await transactor(
                            peggedTokenBridge!.burn(transferToken?.token?.address,
                                value,
                                WALLET_ADDRESS,
                                nonce,
                                {gasLimit: 200000 }),
                            SRC_CHAIN_ID
                        );
            console.log("burnTx hash: " + burnTx.hash);
            console.log("Waiting for the confirmations of burnTx");
            const confirmationReceipt = await getConfirmations(burnTx.hash, CONFIRMATIONS, SRC_CHAIN_RPC); // instead of waiting for fixed time, wait for some confirmations
            console.log(`burnTx confirmed upto ${confirmationReceipt.confirmations} confirmations`);
            console.log("4. getTransferStatus for this transaction until the transfer is complete or needs a refund");
            statusTracker(CBRIDGE_GATEWAY_URL, burnId)
        }
    } catch (error: any) {
        console.log(`-Error:`, error)
    }
}
