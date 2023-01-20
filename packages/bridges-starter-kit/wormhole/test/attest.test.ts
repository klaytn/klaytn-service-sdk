import { expect } from "chai"
import { attest } from "../use-cases"

describe("attest", () => {
    test("Token attestation", async () => {
        let config = { wormhole: { restAddress: "https://wormhole-v2-testnet-api.certus.one" }};
        let source = {
          token: "0x0FD3f122A9B6471928B60eeE73bF35D895C4Ee01", // Token to be attested
          privatekey: "",
          rpcUrl: "https://api.baobab.klaytn.net:8651",
          coreBridge: "0x1830CC6eE66c84D2F177B94D544967c774E624cA",
          tokenBridge: "0xC7A13BE098720840dEa132D860fDfa030884b09A",
          wormholeChainId: "13" 
        };
        let destination = {
          privatekey: "",
          rpcUrl: "https://ethereum-goerli-rpc.allthatnode.com",
          tokenBridge: "0xF890982f9310df57d00f659cf4fd87e65adEd8d7",
          wormholeChainId: "2" 
        }
        let expectedOutput = "0x345";
        let actualOutput = await attest(config, source, destination);
        expect(expectedOutput).to.equal(actualOutput);
    });
});