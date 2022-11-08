import { Contract, providers, utils, Wallet } from "ethers"
import BridgeABI from "../contract/abi/Bridge.sol/Bridge.json"
import OriginalTokenVaultABI from '../contract/abi/pegged/OriginalTokenVault.sol/OriginalTokenVault.json';
import OriginalTokenVaultV2ABI from '../contract/abi/pegged/OriginalTokenVaultV2.sol/OriginalTokenVaultV2.json';
import PeggedTokenBridgeABI from '../contract/abi/pegged/PeggedTokenBridge.sol/PeggedTokenBridge.json';
import PeggedTokenBridgeV2ABI from '../contract/abi/pegged/PeggedTokenBridgeV2.sol/PeggedTokenBridgeV2.json';

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

export const originalTokenVault = new Contract(process.env.ORIGINAL_TOKEN_VAULT_CONTRACT || '', originalTokenVaultInterface, signer);

const originalTokenVaultV2Interface = new utils.Interface(OriginalTokenVaultV2ABI.abi);

export const originalTokenVaultV2 = new Contract(process.env.ORIGINAL_TOKEN_VAULT_V2_CONTRACT || '', originalTokenVaultV2Interface, signer);

const peggedTokenBridgeInterface = new utils.Interface(PeggedTokenBridgeABI.abi);

export const peggedTokenBridge = new Contract(process.env.PEGGED_TOKEN_BRIDGE_CONTRACT || '', peggedTokenBridgeInterface, signer);

const peggedTokenBridgeV2Interface = new utils.Interface(PeggedTokenBridgeV2ABI.abi);

export const peggedTokenBridgeV2 = new Contract(process.env.PEGGED_TOKEN_BRIDGE_V2_CONTRACT || '', peggedTokenBridgeV2Interface, signer)