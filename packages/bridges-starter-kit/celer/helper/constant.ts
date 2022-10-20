import { Contract, providers, utils, Wallet } from "ethers"
import BridgeABI from "../contract/abi/Bridge.sol/Bridge.json"

const bridgeInterface = new utils.Interface(BridgeABI.abi)

export const signer = new Wallet(
    process.env.PRIVATE_KEY || "",
    new providers.JsonRpcProvider(process.env.KLAYTN_RPC)
)

export const bridge = new Contract(
    process.env.KLAYTN_BRIDGE_CONTRACT || "",
    bridgeInterface,
    signer
)
