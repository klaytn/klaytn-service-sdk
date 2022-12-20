import { Contract, providers, utils, Wallet } from "ethers"

export const getSigner = (chainRPC: string, privateKey?: string) => {
    return new Wallet(
        privateKey || "",
        new providers.JsonRpcProvider(chainRPC)
    );
}

export const getContract = (address: string, abi: any, chainRPC: string, privateKey?: string) => {
    const contractSigner = getSigner(chainRPC, privateKey);
    const contractInterface = new utils.Interface(abi);
    return new Contract(address, contractInterface, contractSigner)
}
