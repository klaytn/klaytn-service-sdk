import { Contract, providers, utils, Wallet } from "ethers"

export const getSigner = (chainId?: number) => {
    let rpcUrl = "";
    if(parseInt(process.env.CHAIN1_ID!) == chainId) {
        rpcUrl = process.env.CHAIN1_RPC!;
    } else if(parseInt(process.env.CHAIN2_ID!) == chainId) {
        rpcUrl = process.env.CHAIN2_RPC!;
    }
    return new Wallet(
        process.env.PRIVATE_KEY || "",
        new providers.JsonRpcProvider(rpcUrl)
    );
}

export const getContract = (address: string, abi: any, chainId?: number) => {
    const contractSigner = getSigner(chainId)
    const contractInterface = new utils.Interface(abi);
    return new Contract(address, contractInterface, contractSigner)
}