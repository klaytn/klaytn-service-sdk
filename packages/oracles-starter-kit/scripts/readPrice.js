/* eslint-disable no-process-exit */
// yarn hardhat node
// yarn hardhat run scripts/readPrice.js --network localhost
const { ethers } = require("hardhat")

async function readPrice() {
  try {
    const priceConsumerV3 = await ethers.getContract("PriceConsumerV3")
    const price = await priceConsumerV3.getLatestPrice()
    return price.toString();
  } catch(err) {
    console.log(err);
  }
}