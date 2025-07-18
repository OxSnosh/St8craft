#!/usr/bin/env ts-node

/**
 * Relayer / Initiator for SpyOperationsContractV25 (VRF v2.5 + ERC2771 + Masking).
 *
 * Modes:
 *  A. sponsored-erc2771  -> Production: user signs (front-end context) & Gelato pays gas.
 *  B. sponsored          -> (NOT for production with onlyGelatoRelayERC2771 modifier; for illustration)
 *  C. direct             -> Direct EOA tx (testing only; bypasses relay, **will fail** if modifier enforced)
 *
 * CLI:
 *  ts-node relayer.ts --mode sponsored-erc2771 --attacker 12 --defender 7 --type 4
 *
 * In Mode A you must supply a user signer (in browser) – here we show a pattern to
 * *generate* a WalletClient from a private key IF (and only if) you temporarily
 * control the attacker's account for automated tests. In production, do the
 * `sponsoredCallERC2771` on the FRONT-END with the user's wallet client.
 */

// import 'dotenv/config';
// import {
//   createPublicClient,
//   createWalletClient,
//   http,
//   encodeFunctionData,
//   Hex,
//   defineChain,
//   Account
// } from 'viem';
// import { privateKeyToAccount } from 'viem/accounts';
// import {
//   GelatoRelay,
//   SponsoredCallRequest,
//   CallWithERC2771Request
// } from '@gelatonetwork/relay-sdk-viem';

// // -------------------- Configuration & Constants --------------------

// const {
//   RPC_URL,
//   CHAIN_ID,
//   GELATO_RELAY_API_KEY,
//   TRUSTED_FORWARDER,
//   SPY_OPS_ADDRESS,
//   RELAYER_PRIVATE_KEY,
//   LOG_LEVEL
// } = process.env;

// if (!RPC_URL) throw new Error('Missing RPC_URL');
// if (!CHAIN_ID) throw new Error('Missing CHAIN_ID');
// if (!SPY_OPS_ADDRESS) throw new Error('Missing SPY_OPS_ADDRESS');
// if (!GELATO_RELAY_API_KEY) throw new Error('Missing GELATO_RELAY_API_KEY');
// if (!TRUSTED_FORWARDER) console.warn('[WARN] TRUSTED_FORWARDER missing (needed for assertions / doc).');

// const chainIdNum = Number(CHAIN_ID);

// // Minimal ABI: only the function we call
// const SpyOpsAbi = [
//   'function initiateSpyAttack(uint256 attackerId, uint256 defenderId, uint8 attackType) returns (uint256)'
// ] as const;

// // viem chain definition (custom if not in viem preset)
// const customChain = defineChain({
//   id: chainIdNum,
//   name: 'CustomChain',
//   nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
//   rpcUrls: { default: { http: [RPC_URL] } }
// });

// // Logging helper
// function log(level: 'info'|'error'|'debug', msg: string, obj?: any) {
//   const active = (LOG_LEVEL || 'info');
//   const order = { error: 0, info: 1, debug: 2 } as Record<string, number>;
//   if (order[level] <= order[active]) {
//     if (obj) console.log(`[${level.toUpperCase()}] ${msg}`, obj);
//     else console.log(`[${level.toUpperCase()}] ${msg}`);
//   }
// }

// // -------------------- Utility: Parse CLI Args --------------------

// interface CliArgs {
//   mode: 'sponsored-erc2771' | 'sponsored' | 'direct';
//   attacker: number;
//   defender: number;
//   type: number;
//   // For automation tests only – user private key (NEVER in production)
//   userPk?: string;
// }

// function parseArgs(): CliArgs {
//   const args = process.argv.slice(2);
//   const out: any = {};
//   for (let i = 0; i < args.length; i++) {
//     if (args[i].startsWith('--')) {
//       const key = args[i].substring(2);
//       const val = args[i + 1];
//       out[key] = val;
//       i++;
//     }
//   }
//   if (!out.mode) throw new Error('--mode required (sponsored-erc2771 | sponsored | direct)');
//   if (!out.attacker) throw new Error('--attacker <nationId> required');
//   if (!out.defender) throw new Error('--defender <nationId> required');
//   if (!out.type) throw new Error('--type <attackType (1..12)> required');
//   return {
//     mode: out.mode,
//     attacker: Number(out.attacker),
//     defender: Number(out.defender),
//     type: Number(out.type),
//     userPk: out.userPk
//   };
// }

// // -------------------- Clients --------------------

// const publicClient = createPublicClient({
//   chain: customChain,
//   transport: http()
// });

// const relayerEOA = RELAYER_PRIVATE_KEY
//   ? createWalletClient({
//       chain: customChain,
//       transport: http(),
//       account: privateKeyToAccount(RELAYER_PRIVATE_KEY as Hex)
//     })
//   : null;

// // -------------------- Encoders --------------------

// function encodeInitiate(attackerId: number, defenderId: number, attackType: number): Hex {
//   return encodeFunctionData({
//     abi: SpyOpsAbi,
//     functionName: 'initiateSpyAttack',
//     args: [BigInt(attackerId), BigInt(defenderId), attackType]
//   });
// }

// // -------------------- Mode A: ERC2771 Sponsored --------------------
// /**
//  * In production the *front-end* should hold the user's signer and call this logic
//  * (minus any private key usage). Here we allow injecting a test user private key
//  * via --userPk ONLY for test automation.
//  *
//  * Flow:
//  *   - Build call data
//  *   - Build CallWithERC2771Request
//  *   - relay.sponsoredCallERC2771(request, userWalletClient, apiKey)
//  */
// async function runSponsoredERC2771(attacker: number, defender: number, attackType: number, userPk?: string) {
//   if (!userPk) {
//     console.log('\n[INFO] Mode A requires a user signature. Provide --userPk ONLY for test automation.\nIn real deployment call this from front-end with wallet signer.\n');
//     throw new Error('Missing --userPk for test automation of ERC2771.');
//   }
//   const userAccount = privateKeyToAccount(userPk as Hex);
//   const userWalletClient = createWalletClient({
//     chain: customChain,
//     transport: http(),
//     account: userAccount
//   });

//   // Optional: quick off-chain ownership pattern check (if you have an enumerable mapping).
//   // You could add a view function in the contract or rely purely on on-chain revert.
//   // Here we skip and trust contract.

//   const data = encodeInitiate(attacker, defender, attackType);

//   const relay = new GelatoRelay({
//     contract: { relay1BalanceERC2771: TRUSTED_FORWARDER } as any
//   });

//   const request: CallWithERC2771Request = {
//     chainId: BigInt(chainIdNum),
//     target: SPY_OPS_ADDRESS as `0x${string}`,
//     data,
//     user: userAccount.address as `0x${string}`
//   };

//   log('info', 'Submitting sponsoredCallERC2771 request', { attacker, defender, attackType });
//   const resp = await relay.sponsoredCallERC2771(request, userWalletClient as any, GELATO_RELAY_API_KEY!);
//   log('info', 'Gelato task submitted (ERC2771)', resp);

//   return resp; // contains taskId
// }

// // -------------------- Mode B: Plain Sponsored (NOT for this contract) --------------------
// async function runSponsoredNonERC2771(attacker: number, defender: number, attackType: number) {
//   const data = encodeInitiate(attacker, defender, attackType);
//   const request: SponsoredCallRequest = {
//     chainId: BigInt(chainIdNum),
//     target: SPY_OPS_ADDRESS as `0x${string}`,
//     data
//   };
//   const relay = new GelatoRelay();
//   log('info', 'Submitting (NON-ERC2771) sponsoredCall (will fail if contract enforces onlyGelatoRelayERC2771)');
//   const resp = await relay.sponsoredCall(request, GELATO_RELAY_API_KEY!);
//   log('info', 'Gelato task submitted (Non-ERC2771)', resp);
//   return resp;
// }

// // -------------------- Mode C: Direct EOA Tx (Testing) --------------------
// async function runDirect(attacker: number, defender: number, attackType: number) {
//   if (!relayerEOA) throw new Error('RELAYER_PRIVATE_KEY required for direct mode');
//   const data = encodeInitiate(attacker, defender, attackType);
//   log('info', 'Sending direct transaction (will revert if onlyGelatoRelayERC2771 enforced)');
//   const hash = await relayerEOA.sendTransaction({
//     to: SPY_OPS_ADDRESS as `0x${string}`,
//     data
//   });
//   log('info', 'Direct tx sent', { hash });
//   return { txHash: hash };
// }

// // -------------------- Optional: Polling Helper --------------------
// /**
//  * Polls the public client for events after a task submission.
//  * Realistically you’d run a separate indexer or use a websocket.
//  */
// async function pollForResolution(attackId: bigint, timeoutMs = 120_000, intervalMs = 5_000) {
//   const start = Date.now();
//   while (Date.now() - start < timeoutMs) {
//     // Example: read final struct via public getter once you added one
//     // Here we assume getAttackPublic(id) (already in contract) – you can call via readContract
//     try {
//       const result = await publicClient.readContract({
//         address: SPY_OPS_ADDRESS as `0x${string}`,
//         abi: [{
//           name: 'getAttackPublic',
//             type: 'function',
//             stateMutability: 'view',
//             inputs: [{ name: 'id', type: 'uint256' }],
//             outputs: [
//               { type: 'uint256', name: 'attackerIdOrMask' },
//               { type: 'uint256', name: 'defenderId' },
//               { type: 'uint8',   name: 'attackType' },
//               { type: 'bool',    name: 'success' },
//               { type: 'bool',    name: 'revealed' },
//               { type: 'bool',    name: 'resolved' }
//             ]
//         }],
//         functionName: 'getAttackPublic',
//         args: [attackId]
//       });

//       const resolved = result[5] as boolean;
//       if (resolved) {
//         log('info', 'Attack resolved', {
//           attackId: attackId.toString(),
//           attackerMaskOrId: result[0].toString(),
//           defender: result[1].toString(),
//           attackType: result[2],
//           success: result[3],
//           revealed: result[4]
//         });
//         return result;
//       }
//     } catch (e: any) {
//       // Before resolution call reverts ("NOT_RESOLVED"), ignore.
//     }
//     await new Promise(r => setTimeout(r, intervalMs));
//   }
//   throw new Error('Timeout waiting for resolution.');
// }

// // -------------------- Main Runner --------------------

// (async () => {
//   const args = parseArgs();
//   if (args.type < 1 || args.type > 12) throw new Error('attackType must be 1..12');

//   let response: any;

//   if (args.mode === 'sponsored-erc2771') {
//     response = await runSponsoredERC2771(args.attacker, args.defender, args.type, args.userPk);
//     // You *only* have the Gelato taskId here, not the attackId yet.
//     // To get attackId you can:
//     //  1. Listen for SpyAttackCommitted(taskEvent) off-chain (subgraph, logs).
//     //  2. Add an off-chain mapping (taskId -> ephemeral storage) by querying recent events.
//   } else if (args.mode === 'sponsored') {
//     response = await runSponsoredNonERC2771(args.attacker, args.defender, args.type);
//   } else if (args.mode === 'direct') {
//     response = await runDirect(args.attacker, args.defender, args.type);
//   } else {
//     throw new Error('Unknown mode');
//   }

//   log('info', 'Submission Result', response);

//   console.log('\nNOTE:\n - For ERC2771 sponsored mode, monitor Gelato task status endpoint or parse SpyAttackCommitted events to get the attackId.\n - Then you can call pollForResolution(attackId) after VRF fulfillment.\n');
// })();

// ~/utils/spy_attack_relayer.ts
import { Address, encodeFunctionData } from 'viem';
import { GelatoRelay, CallWithERC2771Request } from '@gelatonetwork/relay-sdk-viem';
import { WalletClient } from 'viem';

// --- ABI fragment for initiateSpyAttack ---
export const SPY_OPS_ABI = [
  'function initiateSpyAttack(uint256 attackerId, uint256 defenderId, uint8 attackType) returns (uint256)'
] as const;

export interface RelaySpyAttackParams {
  attackerId: number;
  defenderId: number;
  attackType: number;
  spyOpsAddress: Address;
  userAddress: `0x${string}`;    // wallet address of player (signer)
  walletClient: WalletClient;    // wagmi/viem wallet client for that user (NOT a relayer PK)
  gelatoApiKey: string;          // Sponsor API key (should come from server-side env)
  chainId: number;
}

export interface RelaySpyAttackResult {
  taskId: string;            // Gelato task ID
  attackerId: number;
  defenderId: number;
  attackType: number;
}

/**
 * Relay via Gelato ERC2771 (Production path)
 */
export async function relaySpyAttackERC2771(params: RelaySpyAttackParams): Promise<RelaySpyAttackResult> {
  const {
    attackerId,
    defenderId,
    attackType,
    spyOpsAddress,
    userAddress,
    walletClient,
    gelatoApiKey,
    chainId,
  } = params;

  if (attackType < 1 || attackType > 12) {
    throw new Error('attackType must be 1..12');
  }

  const data = encodeFunctionData({
    abi: SPY_OPS_ABI,
    functionName: 'initiateSpyAttack',
    args: [BigInt(attackerId), BigInt(defenderId), attackType],
  });

  // Use default forwarders: do NOT pass custom contract config unless you need overrides.
  const relay = new GelatoRelay();

  const request: CallWithERC2771Request = {
    chainId: BigInt(chainId),
    target: spyOpsAddress,
    data,
    user: userAddress,
  };

  const response = await relay.sponsoredCallERC2771(
    request,
    walletClient as any,
    gelatoApiKey
  );

  return {
    taskId: response.taskId,
    attackerId,
    defenderId,
    attackType,
  };
}

/**
 * Direct send (development only) – CALLS THE CONTRACT DIRECTLY (not masked / not relayed).
 * Only use if your contract does **not** strictly enforce onlyGelatoRelayERC2771
 * or when running against a local deployment that allows EOA calls.
 */
export async function directSpyAttack(
  writeContractAsync: (args: any) => Promise<`0x${string}`>,
  spyOpsAddress: Address,
  attackerId: number,
  defenderId: number,
  attackType: number,
) {
  if (attackType < 1 || attackType > 12) throw new Error('attackType must be 1..12');

  return await writeContractAsync({
    address: spyOpsAddress,
    abi: SPY_OPS_ABI,
    functionName: 'initiateSpyAttack',
    args: [BigInt(attackerId), BigInt(defenderId), attackType],
  });
}

// Named export example to match *old* import name if you want to keep it:
export const relaySpyOperation = relaySpyAttackERC2771;

// Default export (optional)
export default {
  relaySpyAttackERC2771,
  directSpyAttack,
  relaySpyOperation: relaySpyAttackERC2771,
};