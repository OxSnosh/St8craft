import { Web3Function, Web3FunctionContext } from "@gelatonetwork/web3-functions-sdk";
import { Contract, Interface, id , JsonRpcProvider} from "ethers";

const ORACLE_ABI = [
  "function completeElection(uint256 orderId, uint256[][] winners) external"
];

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { multiChainProvider } = context;
  const provider = new JsonRpcProvider("https://sepolia.base.org")

  const senateAddress = "0xdAcD0aa01079A76fDd2235dB5663111Aec5C2400";
  const senate = new Contract(senateAddress, ORACLE_ABI, provider);

  const EVENT_ABI = [
    "event ElectionStarted(uint256 epoch, uint256[] team1Votes, uint256[] team2Votes, uint256[] team3Votes, uint256[] team4Votes, uint256[] team5Votes, uint256[] team6Votes, uint256[] team7Votes, uint256[] team8Votes, uint256 orderId)"
  ];

  const iface = new Interface(EVENT_ABI);
  const latestBlock = await provider.getBlockNumber();
  
  const logs = await provider.getLogs({
    address: senateAddress,
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
    .filter((e) => e?.name === "ElectionStarted");

  if (parsedEvents.length === 0) {
    return { canExec: false, message: "No ElectionStarted events found" };
  }

  const event = parsedEvents[parsedEvents.length - 1];

  if (!event || !event.args) {
    return { canExec: false, message: "No valid ElectionStarted event found" };
  }

  const epoch = Number(event.args.epoch);
  const orderId = Number(event.args.orderId);

  const winnersByTeam: number[][] = [];

  for (let i = 1; i <= 8; i++) {
    const teamVotes: bigint[] = event.args[`team${i}Votes`];
    const freqs: Record<number, number> = {};

    for (const vote of teamVotes) {
      const n = Number(vote);
      freqs[n] = (freqs[n] || 0) + 1;
    }

    const sorted = Object.entries(freqs)
      .map(([key, val]) => [val, Number(key)])
      .sort((a, b) => b[0] - a[0]);

    const top5: number[] = sorted.slice(0, 5).map(([, id]) => id);
    winnersByTeam.push(top5);
  }

  return {
    canExec: true,
    callData: [{
      to: senateAddress,
      data: senate.interface.encodeFunctionData("completeElection", [orderId, winnersByTeam]),
    }],
  };
});