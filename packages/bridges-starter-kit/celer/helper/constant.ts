import { Contract, ContractInterface, providers, utils, Wallet } from "ethers"

export const signer = new Wallet(
    process.env.PRIVATE_KEY || "",
    new providers.JsonRpcProvider(process.env.KLAYTN_RPC)
)

export const getContract = (address: string, abi: any) => {
    const contractInterface = new utils.Interface(abi);
    return new Contract(address, contractInterface, signer)
}