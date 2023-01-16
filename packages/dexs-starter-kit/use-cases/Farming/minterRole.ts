import { Farming} from "../../core"

/**
* A function that encodes all the details required to grant minter role to Farming contract on platformToken contract.
* @param {string} rpcURL - RPC URL of blockchain provider.
* @param {string} privKey - secret key of account with which you want to sign the transaction.
* @param {string} farmingAddress - Farming contract's address to whom minter is to be granted.
* @param {string} platformTokenAddress - Address of the platform token i.e: ptnToken of whom minter role to be granted to Farming contract.
* @return {string} - encoded raw transaction data to be submitted & executed by Multisig contract.
*/
export async function minterRole(
    rpcURL: string,
    privKey: string,
    farmingAddress: string,
    platformTokenAddress: string
    ): Promise<string> {
    console.log('minterRole# initiating...')

    console.log('minterRole# Farming => setting up')
    const farming = new Farming(farmingAddress, privKey, rpcURL);
    console.log('minterRole# Farming => role => checking')
    const roleTx: string | boolean = await farming.ptnGrantRole(platformTokenAddress);
    if(!roleTx) throw new Error('minterRole# Farming => role => already MINTER_ROLE granted')
    console.log('minterRole# Farming => role => need to be granted')
    console.log('minterRole# Farming => Transaction => encoding')

    console.log('minterRole# Farming => Transaction => ready to submit on MultiSig')
    console.log('minterRole# Farming => Transaction => details:', roleTx)
    return roleTx as string;
}
