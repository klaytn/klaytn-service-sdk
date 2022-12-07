import {
	transferFromEth,
	parseSequenceFromLogEth,
	getEmitterAddressEth,
  transferFromEthNative,
  tryNativeToHexString,
  CHAIN_ID_KLAYTN,
  CHAIN_ID_ETH
} from '@certusone/wormhole-sdk';
import { Contract, providers, utils, Wallet } from "ethers"
import axios from 'axios';
require("dotenv").config();

// Transfer from Klaytn to Goerli (Works only for EVM compatible chains)
// Attest the token before performing a transfer

let config = {
  wormhole: {
    restAddress: 'https://wormhole-v2-testnet-api.certus.one'
  }
};
const AMOUNT = "1"; // Amount to be transfered 1 Coin
const IS_NATIVE = true; // Enable if Native coin is transfered

const source = {
  token: "0x0FD3f122A9B6471928B60eeE73bF35D895C4Ee01", // source token
  privatekey: process.env.PRIVATE_KEY || "",
  rpcUrl: "https://api.baobab.klaytn.net:8651",
  coreBridge: "0x1830CC6eE66c84D2F177B94D544967c774E624cA",
  tokenBridge: "0xC7A13BE098720840dEa132D860fDfa030884b09A",
  wormholeChainId: CHAIN_ID_KLAYTN
};

const destination = {
  privatekey: process.env.PRIVATE_KEY || "",
  rpcUrl: "https://ethereum-goerli-rpc.allthatnode.com",
  tokenBridge: "0xF890982f9310df57d00f659cf4fd87e65adEd8d7",
  wormholeChainId: CHAIN_ID_ETH, // Goerli
  targetChainId: 5 // Goerli chainid
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
  tryNativeToHexString(destinationnWallet.address, "ethereum"),
  "hex"
);
let Bridge =  require('./bridge.json');

(async () => {
  console.log("1. Submit transaction - results in a Wormhole message being published");

  let receipt:any;
  if(IS_NATIVE) {
    receipt = await transferFromEthNative(
      source.tokenBridge,
      sourceWallet,
      utils.parseUnits(AMOUNT, 18),
      destination.wormholeChainId,
      targetReceipient,
      undefined,
      undefined,
      undefined
    );
  } else {
    console.log("Check the tokens have enough approval to the tokenBridge");
    let Erc20ABI =  require('./erc20.json');
    const tokenInterface = new utils.Interface(Erc20ABI);

    // check allowance and approve
    // Here we are approving and transfering 50 tokens. The ERC20 token we are transfering has 18 decimal places.
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

    receipt = await transferFromEth(
      source.tokenBridge,
      sourceWallet,
      source.token,
      utils.parseUnits(AMOUNT, tokenContract?.decimal ?? 18),
      destination.wormholeChainId,
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
  console.log("Transaction status: https://goerli.etherscan.io/tx/"+completeTransferTx.hash);
})();