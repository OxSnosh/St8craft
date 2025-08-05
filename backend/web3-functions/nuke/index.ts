import { Web3Function, Web3FunctionContext } from "@gelatonetwork/web3-functions-sdk";
import { Contract, Interface, id , JsonRpcProvider} from "ethers";
import { request } from 'http';

const ORACLE_ABI = [
  "function completeNukeAttack(uint256 requestId) external"
];

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { multiChainProvider } = context;
  const provider = new JsonRpcProvider("https://sepolia.base.org")

  const nukeAddress = "0x5be7bDc3a213A75Eb2699B9ADB0770c4113083df";
  const nuke = new Contract(nukeAddress, ORACLE_ABI, provider);

  const EVENT_ABI = [
    "event NukeAttackPending(uint256 requestId)"
  ];

  const iface = new Interface(EVENT_ABI);
  const latestBlock = await provider.getBlockNumber();
  
  const logs = await provider.getLogs({
    address: nukeAddress,
    fromBlock: latestBlock - 100,
    toBlock: "latest",
  });

  console.log(`Fetched ${logs.length} logs from last 100 blocks`);

  const parsedEvents = logs
    .map((log) => {
      try {
        return iface.parseLog(log);
      } catch {
        return null;
      }
    })
    .filter((e) => e?.name === "NukeAttackPending");

  if (parsedEvents.length === 0) {
    return { canExec: false, message: "No NukeAttackPending events found" };
  }

  const event = parsedEvents[parsedEvents.length - 1];

  if (!event || !event.args) {
    return { canExec: false, message: "No valid NukeAttackPending event found" };
  }

  const requestId = Number(event.args.requestId);


  return {
    canExec: true,
    callData: [{
      to: nukeAddress,
      data: nuke.interface.encodeFunctionData("completeNukeAttack", [requestId]),
    }],
  };
});