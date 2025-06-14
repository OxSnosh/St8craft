import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

// 1. Load private key and validate it
const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error("PRIVATE_KEY not set in .env");
}

// 2. Set up the provider for Base Sepolia
const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");

// 3. Create signer from private key
const signer = new ethers.Wallet(privateKey, provider);

// 4. Define the target contract address
const contractAddress = "0xCAa525E997bBc30DDb7393F098f5A8519c721c79"; // ← change this

// 5. Send ETH (e.g., 0.01 ETH)
async function sendEthToContract() {
  const tx = await signer.sendTransaction({
    to: contractAddress,
    value: ethers.parseEther("0.0025"), // Amount of ETH
  });

  console.log(`TX sent! Hash: ${tx.hash}`);
  const receipt = await tx.wait();
  if (receipt) {
    console.log("✅ TX confirmed in block:", receipt.blockNumber);
  } else {
    console.log("⚠️ TX receipt is null.");
  }
}

sendEthToContract().catch(console.error);