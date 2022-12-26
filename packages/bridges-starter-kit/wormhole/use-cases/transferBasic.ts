import {
	transferFromEth,
	parseSequenceFromLogEth,
	getEmitterAddressEth,
  transferFromEthNative,
  tryNativeToHexString,
  CHAINS
} from '../core';
import { Contract, ContractTransaction, providers, utils, Wallet } from "ethers"
import axios from 'axios';
import Bridge from '../core/abi/bridge.json';
import Erc20ABI from '../core/abi/erc20.json';


// Transfer native coins/tokens from Source chain to Destination chain (Below code works only for EVM compatible chains)
// Attest the token before performing a transfer

export async function transferBasic(
    config: { wormhole: { restAddress: string } },
    source: {
      token: string, // source token
      privatekey: string,
      rpcUrl: string,
      coreBridge: string,
      tokenBridge: string,
      wormholeChainId: string },
    destination: {
      privatekey: string,
      rpcUrl: string,
      tokenBridge: string,
      wormholeChainId: string },
    AMOUNT: string, // Amount to be transferred
    IS_NATIVE: boolean // Enable if Native coin is transferred
): Promise<ContractTransaction> {

  const CHAINSBYID = Object.entries(CHAINS).reduce((acc:any, curr:any) => {
    acc[curr[1].toString()] = { name: curr[0].toString(), chainId: curr[1] };
    return acc;
  }, {});
  const sourceWallet = new Wallet(
      source.privatekey,
      new providers.JsonRpcProvider(source.rpcUrl)
  );
  const destinationnWallet = new Wallet(
      destination.privatekey,
      new providers.JsonRpcProvider(destination.rpcUrl)
  );

  const targetReceipient = Buffer.from(
      tryNativeToHexString(destinationnWallet.address, CHAINSBYID[destination.wormholeChainId].name),
      "hex"
  );

  console.log("1. Submit transaction - results in a Wormhole message being published");

  let receipt:any;
  if(IS_NATIVE) {
    receipt = await transferFromEthNative(
      source.tokenBridge,
      sourceWallet,
      utils.parseUnits(AMOUNT, 18),
      CHAINSBYID[destination.wormholeChainId].chainId,
      targetReceipient,
      undefined,
      undefined,
      undefined
    );
  } else {
    console.log("Check the tokens have enough approval to the tokenBridge");
    const tokenInterface = new utils.Interface(Erc20ABI);

    // check allowance and approve
    // Approving and transfering specified tokens.
    const tokenContract = new Contract(source.token, tokenInterface, sourceWallet)
    const allowance = await tokenContract?.allowance(sourceWallet.address, source.tokenBridge);

    console.log("Allowance: "+allowance.toString());
    console.log("Amount   : "+utils.parseUnits(AMOUNT || "0", tokenContract?.decimal ?? 18).toString());
    let isGreaterThanAllowance = false;

      isGreaterThanAllowance = utils.parseUnits(AMOUNT, tokenContract?.decimal ?? 18).gt(
        allowance
      )

    // Approve if amount is greater than allowance
    if(isGreaterThanAllowance) {
      const approveTx = await tokenContract.approve(source.tokenBridge, utils.parseUnits(AMOUNT, tokenContract?.decimal ?? 18),
        {gasLimit: 2000000})
      console.log("Approval TxnHash: "+approveTx.hash);
    }

    await new Promise((r) => setTimeout(r, 2000));

    receipt = await transferFromEth(
      source.tokenBridge,
      sourceWallet,
      source.token,
      utils.parseUnits(AMOUNT, tokenContract?.decimal ?? 18),
      CHAINSBYID[destination.wormholeChainId].chainId,
      targetReceipient,
      undefined,
      undefined,
      undefined
    );
  }

  console.log("2. Retrive VAA and sequence");
  // Get the sequence number and emitter address required to fetch the signedVAA of our message
  const seq = parseSequenceFromLogEth(receipt, source.coreBridge);
  const emitterAddr = getEmitterAddressEth(source.tokenBridge);

  console.log("EmitterAddress: "+ emitterAddr);
  console.log("Sequence: "+ seq);

  const vaaURL = `${config.wormhole.restAddress}/v1/signed_vaa/${source.wormholeChainId}/${emitterAddr}/${seq}`;

  console.log("Searching for: ", vaaURL);
  await new Promise((r) => setTimeout(r, 2000));
  let vaaBytes: any = await axios.get(vaaURL);

  while (!vaaBytes.data && vaaBytes.data.vaaBytes) {
    console.log("VAA not found, retrying in 5s!");
    await new Promise((r) => setTimeout(r, 5000)); //Timeout to let Guardiand pick up log and have VAA ready
    vaaBytes = await axios.get(vaaURL);
  }
  vaaBytes = vaaBytes.data;

  console.log("3. Submit the VAA to the target chain by calling completeTransfer()");
  const contractInterface = new utils.Interface(Bridge['abi']);
  const targetTokenBridge = new Contract(destination.tokenBridge, contractInterface, destinationnWallet)
  const completeTransferTx: ContractTransaction = await targetTokenBridge.completeTransfer(
    Buffer.from(vaaBytes.vaaBytes, "base64"),
    {gasLimit: 2000000 }
  );
  console.log(completeTransferTx);
  console.log("Transaction status on Destination chain: "+completeTransferTx.hash);
  return completeTransferTx;
}
