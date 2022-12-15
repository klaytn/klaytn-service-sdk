import {
	transferFromEth,
	parseSequenceFromLogEth,
	getEmitterAddressEth,
  transferFromEthNative,
  tryNativeToHexString,
  CHAINS
} from '@certusone/wormhole-sdk';
import { Contract, providers, utils, Wallet } from "ethers"
import axios from 'axios';
let Bridge =  require('./abi/bridge.json');
require("dotenv").config();

let CHAINSBYID = Object.entries(CHAINS).reduce((acc:any, curr:any) => {
  acc[curr[1].toString()] = { name: curr[0].toString(), chainId: curr[1] };  
  return acc;
}, {});

// Transfer native coins/tokens from Source chain to Destination chain (Below code works only for EVM compatible chains)
// Attest the token before performing a transfer

let config = {
  wormhole: {
    restAddress: process.env.WORMHOLE_REST_URL?? ''
  }
};
const AMOUNT = process.env.AMOUNT_TO_BE_TRANSFERRED?? ''; // Amount to be transfered
const IS_NATIVE = process.env.IS_NATIVE_TRANSFER || "Y"; // Enable if Native coin is transfered

const source = {
  token: process.env.SOURCE_TOKEN?? '', // source token
  privatekey: process.env.SOURCE_PRIVATE_KEY?? '',
  rpcUrl: process.env.SOURCE_RPC_URL?? '',
  coreBridge: process.env.SOURCE_CORE_BRIDGE?? '',
  tokenBridge: process.env.SOURCE_TOKEN_BRIDGE?? '',
  wormholeChainId: process.env.SOURCE_WORMHOLE_CHAIN_ID?? '13'
};

const destination = {
  privatekey: process.env.DESTINATION_PRIVATE_KEY?? '',
  rpcUrl: process.env.DESTINATION_RPC_URL?? '',
  tokenBridge: process.env.DESTINATION_TOKEN_BRIDGE?? '',
  wormholeChainId: process.env.DESTINATION_WORMHOLE_CHAIN_ID?? '2'
};

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


(async () => {
  console.log("1. Submit transaction - results in a Wormhole message being published");

  let receipt:any;
  if(IS_NATIVE === "Y") {
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
    let Erc20ABI =  require('./abi/erc20.json');
    const tokenInterface = new utils.Interface(Erc20ABI);

    // check allowance and approve
    // Approving and transfering specified tokens.
    const tokenContract = new Contract(source.token, tokenInterface, sourceWallet)
    const allowance = await tokenContract?.allowance(sourceWallet.address, source.tokenBridge);
    
    console.log("Allowance: "+allowance.toString());
    console.log("Amount   : "+utils.parseUnits(AMOUNT || "0", tokenContract?.decimal ?? 18).toString());
    let isGreaterThanAllowance = false;
    try {
      isGreaterThanAllowance = utils.parseUnits(AMOUNT, tokenContract?.decimal ?? 18).gt(
        allowance
      )
    } catch(err) {}

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
  const completeTransferTx = await targetTokenBridge.completeTransfer(
    Buffer.from(vaaBytes.vaaBytes, "base64"),
    {gasLimit: 2000000 }
  );
  console.log(completeTransferTx);
  console.log("Transaction status on Destination chain: "+completeTransferTx.hash);
})();