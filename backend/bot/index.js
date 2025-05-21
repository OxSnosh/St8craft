require("dotenv").config();
const { ethers } = require("ethers");
const { runKeeperBot } = require("./KeeperBot");
const { runSenateBot } = require("./SenateBot");
const { address: keeperAddress, abi: keeperAbi } = require("../deployments/localhost/KeeperContract.json");
const { address: senateAddress, abi: senateAbi } = require("../deployments/localhost/SenateContract.json");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const interval = parseInt(process.env.INTERVAL_MS);

(async () => {
  const keeperTask = await runKeeperBot(provider, wallet, keeperAddress, keeperAbi);
  const senateTask = await runSenateBot(provider, wallet, senateAddress, senateAbi);

  console.log(`⏳ Bots running every ${interval / 1000}s`);

  setInterval(keeperTask, interval);
  setInterval(senateTask, interval);
})();