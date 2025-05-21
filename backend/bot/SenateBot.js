const { ethers } = require("ethers");
// const senateAbi = require("../artifacts/contracts/Senate.sol/SenateContract.json").abi;

async function runSenateBot(provider, wallet, address, senateAbi) {
  const contract = new ethers.Contract(address, senateAbi, wallet);

  return async () => {
    try {
      const [needed] = await contract.checkUpkeep("0x");
      if (needed) {
        console.log("✅ Senate: Election needed. Sending tx...");
        const tx = await contract.performUpkeep("0x");
        console.log(`📤 Senate: Tx sent ${tx.hash}`);
        await tx.wait();
        console.log("🎉 Senate: Election performed.");
      } else {
        console.log("🕒 Senate: No upkeep needed.");
      }
    } catch (err) {
      console.error("❌ Senate error:", err.message);
    }
  };
}

module.exports = { runSenateBot };