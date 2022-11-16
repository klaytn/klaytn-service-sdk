import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest
import { base64, getAddress, hexlify } from "ethers/lib/utils";
import { config } from "dotenv"
config()

import { getTransferStatus, getTransferConfigs, requestRefund } from "../APIs"
import {
    getContract,
    getPegConfig,
    transactor,
} from "../helper"
import OriginalTokenVaultABI from '../contract/abi/pegged/OriginalTokenVault.sol/OriginalTokenVault.json'
import OriginalTokenVaultV2ABI from '../contract/abi/pegged/OriginalTokenVaultV2.sol/OriginalTokenVaultV2.json';

const rpc: string = process.env.CBRIDGE_GATEWAY_URL!

;(async () => {
    const srcChainId = parseInt(process.env.CHAIN1_ID!);
    const dstChainId = parseInt(process.env.CHAIN2_ID!);

    const tokenSymbol = process.env.TOKEN_SYMBOL!;
    const transferId = "0x6085feec485c109c7c23b2bee61b2ca3f8a78418ac859e48f088f24914a60b6d"; //Replace your transfer Id here

    const transferConfigs = await getTransferConfigs(rpc);

    const originalTokenVaultAddress = transferConfigs.pegged_pair_configs.find(config => config.org_chain_id === srcChainId && config.vault_version < 2)?.pegged_deposit_contract_addr
    const originalTokenVault = getContract(originalTokenVaultAddress || '', OriginalTokenVaultABI.abi, srcChainId)
    const originalTokenVaultV2Address = transferConfigs.pegged_pair_configs.find(config => config.org_chain_id === srcChainId && config.vault_version === 2)?.pegged_deposit_contract_addr
    const originalTokenVaultV2 = getContract(originalTokenVaultV2Address || '', OriginalTokenVaultV2ABI.abi, srcChainId)

    const pegConfig = getPegConfig(transferConfigs, srcChainId, dstChainId, tokenSymbol);
    const vaultVersion = pegConfig?.vault_version;
    const originalTokenContract = vaultVersion === 2 ? originalTokenVaultV2 : originalTokenVault;

    console.log("1. Gateway Withdrawal liquidity request");
    requestRefund(
        rpc,
        transferId,
        ""
    );

    console.log("2. Check transfer status");
    let statusResult = await getTransferStatus(rpc, transferId);

    if(statusResult.wdOnchain) {
        let wd_onchain:any = statusResult.wdOnchain;
        let _signers = statusResult.signersList;
        let sorted_sigs = statusResult.sortedSigsList;
        let _powers = statusResult.powersList;

        console.log("3. Executing orginalvault contract withdraw");
        const wdmsg = base64.decode(wd_onchain);

        const signers = _signers.map((item: any) => {
            const decodeSigners = base64.decode(item);
            const hexlifyObj = hexlify(decodeSigners);
            return getAddress(hexlifyObj);
        });

        const sigs = sorted_sigs.map((item:any) => {
            return base64.decode(item);
        });

        const powers = _powers.map((item: any) => {
            return base64.decode(item);
        });

        let result = await transactor(
            originalTokenContract.withdraw(
                wdmsg, sigs, signers, powers,
                {gasLimit: 100000 }
            ),
            srcChainId
        );

        console.log(result);
        
        console.log("Delaying for 300 seconds for checking refund confirmation status");
        await new Promise(r => setTimeout(r, 300000))

        console.log("4. Check transfer status");
        await getTransferStatus(rpc, transferId)
    } else {
        console.log("Not able to trigger contract withdraw as status info is insufficient");
    }
})()
