import { Contract, ContractInterface, providers, utils, Wallet } from "ethers"

export const defaultKlaytnSigner = new Wallet(
    process.env.PRIVATE_KEY || "",
    new providers.JsonRpcProvider(process.env.KLAYTN_RPC)
)

export const getContract = (address: string, abi: any, signer?: Wallet) => {
    const contractSigner = signer ?? defaultKlaytnSigner
    const contractInterface = new utils.Interface(abi);
    return new Contract(address, contractInterface, contractSigner)
}