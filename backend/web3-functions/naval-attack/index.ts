import { Web3Function, Web3FunctionContext } from "@gelatonetwork/web3-functions-sdk";
import { Contract, Interface, id, JsonRpcProvider } from "ethers";

const ORACLE_ABI = [
  "function completeNavalAttack(uint256[], uint256[], uint256)"
];

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { multiChainProvider } = context;
  const provider = new JsonRpcProvider("https://sepolia.base.org")

  const navalAttackAddress = "0x443dBA349AC5c415a83f604ecDA18538adb43Dcd";
  const navalAttack = new Contract(navalAttackAddress, ORACLE_ABI, provider);

  const EVENT_ABI = [
    "event NavalAttackRequested(uint256 requestId, uint256 battleId, uint256[] randomWords, uint256[] attackerChances, uint256[] attackerTypes, uint256[] defenderChances, uint256[] defenderTypes, uint256 losses)"
  ];

  const iface = new Interface(EVENT_ABI);

  const latestBlock = await provider.getBlockNumber();
  const logs = await provider.getLogs({
    address: navalAttackAddress,
    fromBlock: latestBlock - 100,
    toBlock: "latest"
  });

  console.log(`Fetched ${logs.length} logs from last 100 blocks`);

  if (logs.length === 0) {
    return { canExec: false, message: "No NavalAttackRequested events found" };
  }

  const event = iface.parseLog(logs[logs.length - 1]);

  const parsedEvents = logs
    .map((log) => {
      try {
        return iface.parseLog(log);
      } catch {
        return null;
      }
    })
    .filter((e) => e?.name === "NavalAttackRequested");

  if (parsedEvents.length === 0) throw new Error("No NavalAttackRequested events found");

  if (!event) {
    throw new Error("No valid AirBattleRequested event found");
  }

  const battleId = Number(event.args.battleId);
  const attackerChances = event.args.attackerChances.map((n: bigint) => Number(n));
  const defenderChances = event.args.defenderChances.map((n: bigint) => Number(n));
  const attackerTypes = event.args.attackerTypes.map((n: bigint) => Number(n));
  const defenderTypes = event.args.defenderTypes.map((n: bigint) => Number(n));
  const randomNumbers = event.args.randomWords.map((n: bigint) => BigInt(n));

  function createChunks(numbers: bigint[]) {
    let chunks: string[] = []; // Declare chunks outside the loop to store all results

    for (let i = 0; i < numbers.length; i++) { // Iterate over all numbers
        let numberToSlice = String(BigInt(numbers[i])); // Convert the number to BigInt and then to a string
        let sliceNumber = 0;

        for (let j = 0; j < 5; j++) { // Extract 5 chunks per number
            let chunk = numberToSlice.slice(sliceNumber, sliceNumber + 10);
            if (chunk.length === 10) { // Ensure the chunk has 10 digits
                chunks.push(chunk);
            }
            sliceNumber += 10; // Move to the next slice
        }
    }

    return chunks;
  }

  let chunks : string[] = createChunks(randomNumbers)

    const corvetteTargetSize = 15;
    const landingShipTargetSize = 13;
    const battleshipTargetSize = 11;
    const cruiserTargetSize = 10;
    const frigateTargetSize = 8;
    const destroyerTargetSize = 5;
    const submarineTargetSize = 4;
    const aircraftCarrierTargetSize = 1;

    function amountToDecreaseFunction(type : number) {
        let amountToDecrease = 0
        if (type == 1) {
            amountToDecrease = corvetteTargetSize
        } else if (type == 2) {
            amountToDecrease = landingShipTargetSize
        } else if (type == 3) {
            amountToDecrease = battleshipTargetSize
        } else if (type == 4) {
            amountToDecrease = cruiserTargetSize
        } else if (type == 5) {
            amountToDecrease = frigateTargetSize
        } else if (type == 6) {
            amountToDecrease = destroyerTargetSize
        } else if (type == 7) {
            amountToDecrease = submarineTargetSize
        } else if (type == 8) {
            amountToDecrease = aircraftCarrierTargetSize
        }
        return amountToDecrease
    }

    function shipCount(typeArray : number[], chanceArray: number[]) {
        let shipCount = 0
        for (let i=0; i < typeArray.length ; i++) {
            let type = typeArray[i]
            let divisor = 0
            if (type == 1) {
                divisor = corvetteTargetSize
            } else if (type == 2) {
                divisor = landingShipTargetSize
            } else if (type == 3) {
                divisor = battleshipTargetSize
            } else if (type == 4) {
                divisor = cruiserTargetSize
            } else if (type == 5) {
                divisor = frigateTargetSize
            } else if (type == 6) {
                divisor = destroyerTargetSize
            } else if (type == 7) {
                divisor = submarineTargetSize
            } else if (type == 8) {
                divisor = aircraftCarrierTargetSize
            }

            let numberToDivide;
            let shipToAdd;
    
            if (i === 0) {
                numberToDivide = chanceArray[i];
            } else {
                numberToDivide = chanceArray[i] - chanceArray[i - 1];
            }
    
            shipToAdd = numberToDivide / divisor;
            shipCount += shipToAdd;
        }
        return shipCount
    }

    let shipCountAttacker = shipCount(attackerTypes, attackerChances)
    console.log(shipCountAttacker, "shipCountAttacker")
    let shipCountdefender = shipCount(defenderTypes, defenderChances)
    console.log(shipCountdefender, "shipCountdefender")

    let totalShipCount : number = (shipCountAttacker + shipCountdefender)

    function calculateLosses( totalShips : number) {
        let numberBetweenZeroAndTwo = ( Number(chunks[0]) % 3 )
        console.log(numberBetweenZeroAndTwo)
        let losses
        if (totalShips < 4) {
            losses = 1;
        } else if (totalShips <= 10) {
            losses = (1 + numberBetweenZeroAndTwo);
        } else if (totalShips <= 30) {
            losses = (2 + numberBetweenZeroAndTwo);
        } else if (totalShips <= 50) {
            losses = (3 + numberBetweenZeroAndTwo);
        } else if (totalShips <= 70) {
            losses = (4 + numberBetweenZeroAndTwo);
        } else if (totalShips <= 100) {
            losses = (5 + numberBetweenZeroAndTwo);
        } else {
            losses = (6 + numberBetweenZeroAndTwo);
        }
        return losses;
    }

    let losses = calculateLosses(totalShipCount);
    
    if (shipCountAttacker == 0 || shipCountdefender == 0) {
        losses = 0;
    }
    console.log(losses, "losses")

    function calulateBattleResults(
        losses : number,
        attackerChances : number[],
        attackerTypes : number[],
        defenderChances : number[],
        defenderTypes : number[]
    ): [number[], number[]] {
        let attackerLosses : number[] = []
        let defenderLosses : number[] = []

        for (let i=1; i<=losses; i++) {
            let randomNumber = Number(chunks[i])
            const lastAttackerChance = attackerChances.length > 0 ? attackerChances[attackerChances.length - 1] : 0;
            const lastDefenderChance = defenderChances.length > 0 ? defenderChances[defenderChances.length - 1] : 0;
            let totalStrength: number = lastAttackerChance + lastDefenderChance;
            let selector = (randomNumber % totalStrength)
            console.log(totalStrength, "totalStrength")
            console.log(randomNumber, "randomNumber")
            console.log(selector, "selector")
            if (selector < attackerChances[attackerChances.length-1]) {
                //loss for defender
                console.log("defender loss")
                let secondRandomNumber = Number(chunks[i+10])
                let shipSelector = (secondRandomNumber % defenderChances[defenderChances.length-1])
                let shipType
                let amountToDecrease: number | undefined = undefined;
                let k: number | undefined = undefined;
                let ranAlready = false
                if (ranAlready == false) {
                    for (let j = 0; j < defenderChances.length; j++) {
                        if (shipSelector < defenderChances[j]) {
                            defenderLosses.push(defenderTypes[j])   
                            shipType = defenderTypes[j]
                            amountToDecrease = amountToDecreaseFunction(shipType)
                            k=j
                            break
                        }
                    }
                    console.log(k, "k")
                    console.log(amountToDecrease)
                    if (k !== undefined && amountToDecrease !== undefined) {
                        for (let index = k; index < defenderChances.length; index++) {
                            if (defenderChances[k] >= randomNumber) {
                                defenderChances[k] -= amountToDecrease
                            }
                        }
                        ranAlready = true
                    }
                } else {
                    console.error("k or amountToDecrease is undefined. Skipping iteration.")
                }
            } else {
                //loss for attacker
                console.log("attacker loss")
                let secondRandomNumber = Number(chunks[i+10])
                let shipSelector = (secondRandomNumber % attackerChances[attackerChances.length-1])
                let shipType
                let amountToDecrease: number | undefined = undefined;
                let k: number | undefined = undefined;
                let ranAlready = false
                if (ranAlready == false){
                    for (let j = 0; j < attackerChances.length; j++) {
                        if (shipSelector < attackerChances[j]) {
                            attackerLosses.push(attackerTypes[j])   
                            shipType = attackerTypes[j]
                            amountToDecrease = amountToDecreaseFunction(shipType)
                            k=j
                            break
                        }
                    }
                    console.log(k, "k")
                    console.log(amountToDecrease)
                    if (k !== undefined && amountToDecrease !== undefined) {
                        for (let index = k; index < attackerChances.length; index++) {
                            if (attackerChances[k] >= randomNumber) {
                                attackerChances[k] -= amountToDecrease
                            }
                        }
                        ranAlready = true
                    } else {
                        console.error("k or amountToDecrease is undefined. Skipping iteration.")
                    }
                }
            }
        }
        return [ attackerLosses, defenderLosses ]
    }

    let results = calulateBattleResults(losses, attackerChances, attackerTypes, defenderChances, defenderTypes)
    let attackerLosses = results[0]
    let defenderLosses = results[1]

    console.log("Attacker losses:", attackerLosses);
    console.log("Defender losses:", defenderLosses);
    console.log("Battle ID:", battleId);

  return {
    canExec: true,
    callData: [{
      to: navalAttackAddress,
      data: navalAttack.interface.encodeFunctionData("completeNavalAttack", [attackerLosses, defenderLosses, battleId]),
    }],
  };
});