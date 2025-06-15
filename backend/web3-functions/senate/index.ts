import { Web3Function, Web3FunctionContext } from "@gelatonetwork/web3-functions-sdk";
import { Contract, Interface, id } from "ethers";

const ORACLE_ABI = [
  "function completeElection(uint256 orderId, uint256[] winners) external"
];

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { multiChainProvider } = context;
  const provider = multiChainProvider.default();

  const senateAddress = "0x71b9b0f6c999cbbb0fef9c92b80d54e4973214da"; // update if needed
  const senate = new Contract(senateAddress, ORACLE_ABI);

  const EVENT_ABI = [
    "event ElectionStarted(uint256 team, uint256 epoch, uint256[] teamVotes, uint256 orderId)"
  ];

  const iface = new Interface(EVENT_ABI);
  const eventTopic = id("ElectionStarted(uint256,uint256,uint256[],uint256)");

  const latestBlock = await provider.getBlockNumber();
  const logs = await provider.getLogs({
    address: senateAddress,
    topics: [eventTopic],
    fromBlock: latestBlock - 15,
    toBlock: "latest"
  });

  if (logs.length === 0) {
    return { canExec: false, message: "No ElectionStarted events found" };
  }

  const event = iface.parseLog(logs[logs.length - 1]);

  if (!event) {
    return { canExec: false, message: "Failed to parse ElectionStarted event log" };
  }

  // Extract args
  const team = Number(event.args.team);
  const epoch = Number(event.args.epoch);
  const teamVotes = event.args.teamVotes.map((n: bigint) => Number(n));
  const orderId = Number(event.args.orderId);

  const freqs: Record<number, number> = {};
  for (const vote of teamVotes) {
    freqs[vote] = (freqs[vote] || 0) + 1;
  }

  const frequencyArray = Object.entries(freqs)
    .map(([key, val]) => [val, Number(key)])
    .sort((a, b) => b[0] - a[0]);

  const winners: number[] = frequencyArray.slice(0, 5).map(item => item[1]);

  return {
    canExec: true,
    callData: [{
      to: senateAddress,
      data: senate.interface.encodeFunctionData("completeElection", [orderId, winners]),
    }],
  };
});