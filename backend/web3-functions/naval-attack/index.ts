import { Web3Function, Web3FunctionContext } from "@gelatonetwork/web3-functions-sdk";
import { Contract, ethers } from "ethers";

const ORACLE_ABI = [
  "function completeNavalAttack(uint256[], uint256[], uint256)",
];

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, gelatoArgs, multiChainProvider } = context;
  const provider = multiChainProvider.default();

  const navalAttackAddress = "0x71b9b0f6c999cbbb0fef9c92b80d54e4973214da"; //update
  const navalAttack = new Contract(navalAttackAddress, ORACLE_ABI, provider);

  let battleId = userArgs.battleId;
  let attackerChances = Array.isArray(userArgs.attackerChances) && userArgs.attackerChances.every(item => typeof item === "number")
    ? userArgs.attackerChances as number[]
    : [];
  let defenderChances = Array.isArray(userArgs.defenderChances) && userArgs.defenderChances.every(item => typeof item === "number")
    ? userArgs.defenderChances as number[]
    : [];
  let attackerTypes = Array.isArray(userArgs.attackerTypes) && userArgs.attackerTypes.every(item => typeof item === "number")
    ? userArgs.attackerTypes as number[]
    : [];
  let defenderTypes = Array.isArray(userArgs.defenderTypes) && userArgs.defenderTypes.every(item => typeof item === "number")
    ? userArgs.defenderTypes as number[]
    : [];

  let randomNumbers = Array.isArray(userArgs.randomNumbers) && userArgs.randomNumbers.every(num => typeof num === "number")
    ? userArgs.randomNumbers.map(num => BigInt(num))
    : [];

  function createChunks(numbers: bigint[]) {
    let chunks: string[] = []; // Declare chunks outside the loop to store all results

    for (let i = 0; i < numbers.length; i++) { // Iterate over all numbers
        let numberToSlice = BigInt(numbers[i]).toString(); // Convert the number to BigInt and then to a string
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
    console.log(shipCountAttacker)
    let shipCountdefender = shipCount(defenderTypes, defenderChances)
    console.log(shipCountdefender)

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
    console.log(losses)

    function calulateBattleResults(
        losses : number,
        attackerChances : number[],
        attackerTypes : number[],
        defenderChances : number[],
        defenderTypes : number[]
    ): [number[], number[]] {
        let attackerLosses : number[] = []
        let defenderLosses : number[] = []

        console.log("here?")
        for (let i=1; i<=losses; i++) {
            let randomNumber = Number(chunks[i])
            let totalStrength : number = (attackerChances[attackerChances.length-1] + defenderChances[defenderChances.length-1])
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

  return {
    canExec: true,
    callData: [{
      to: navalAttackAddress,
      data: navalAttack.interface.encodeFunctionData("completeNavalAttack", [attackerLosses, defenderLosses, battleId]),
    }],
  };
});