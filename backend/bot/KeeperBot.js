const { ethers } = require("ethers");
// const {abi: keeperAbi} = require("../artifacts/contracts/KeeperFile.sol/KeeperContract.json")

async function runKeeperBot(provider, wallet, address, keeperAbi) {

  const contract = new ethers.Contract(address, keeperAbi, wallet);

  return async () => {
    try {
      const [needed] = await contract.checkUpkeep("0x");
      if (needed) {
        console.log("✅ Keeper: Upkeep needed. Sending tx...");
        const tx = await contract.performUpkeep("0x");
        console.log(`📤 Keeper: Tx sent ${tx.hash}`);
        await tx.wait();
        console.log("🎉 Keeper: Upkeep complete.");
      } else {
        console.log("🕒 Keeper: No upkeep needed.");
      }
    } catch (err) {
      console.error("❌ Keeper error:", err.message);
    }
  };
}

module.exports = { runKeeperBot };