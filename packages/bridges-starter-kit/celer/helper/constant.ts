import { Contract, providers, utils, Wallet } from "ethers"
import BridgeABI from "../contract/abi/Bridge.sol/Bridge.json"
import OriginalTokenVaultABI from '../contract/abi/pegged/OriginalTokenVault.sol/OriginalTokenVault.json';

export const signer = new Wallet(
    process.env.PRIVATE_KEY || "",
    new providers.JsonRpcProvider(process.env.KLAYTN_RPC)
)

const bridgeInterface = new utils.Interface(BridgeABI.abi)

export const bridge = new Contract(
    process.env.KLAYTN_BRIDGE_CONTRACT || "",
    bridgeInterface,
    signer
)

const originalTokenVaultInterface = new utils.Interface(OriginalTokenVaultABI.abi);

export const originalTokenVault = new Contract(process.env.BNB_ORIGINAL_TOKEN_VAULT_CONTRACT || '', originalTokenVaultInterface, signer); //BNB originalTokenVault contract
