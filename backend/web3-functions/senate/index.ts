import { Web3Function, Web3FunctionContext } from "@gelatonetwork/web3-functions-sdk";
import { Contract, ethers } from "ethers";

const ORACLE_ABI = [
  "function completeElection(uint256 _orderId, uint256[] _winners) public",
];

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, gelatoArgs, multiChainProvider } = context;
  const provider = multiChainProvider.default();

  console.log("userArgs", userArgs);
  console.log(provider, "provider");

  const senateAddress = "0x71b9b0f6c999cbbb0fef9c92b80d54e4973214da"; //update
  const senate = new Contract(senateAddress, ORACLE_ABI, provider);

  const orderId = Number(userArgs.orderId);
  const teamVotes = Array.isArray(userArgs.teamVotes) && userArgs.teamVotes.every(item => typeof item === "number")
    ? userArgs.teamVotes as number[]
    : [];

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