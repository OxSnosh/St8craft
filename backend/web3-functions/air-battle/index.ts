import { Web3Function, Web3FunctionContext } from "@gelatonetwork/web3-functions-sdk";
import { Contract, ethers } from "ethers";

const ORACLE_ABI = [
  "function completeAirBattle(uint256[], uint256[], uint256[], uint256, uint256, uint256, uint256, uint256, uint256)",
];

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, gelatoArgs, multiChainProvider } = context;
  const provider = multiChainProvider.default();

  const airBattleAddress = "0x71b9b0f6c999cbbb0fef9c92b80d54e4973214da"; //update
  const airBattle = new Contract(airBattleAddress, ORACLE_ABI, provider);

  let battleId = userArgs.battleId;
  const attackerId = userArgs.attackerId;
  const defenderId = userArgs.defenderId;

  let randomNumbers = Array.isArray(userArgs.randomNumbers) && userArgs.randomNumbers.every(num => typeof num === "number")
    ? userArgs.randomNumbers.map(num => BigInt(num))
    : [];

  let defenderFightersArr = Array.isArray(userArgs.defenderFighters) && userArgs.defenderFighters.every(num => typeof num === "number")
    ? userArgs.defenderFighters
    : [];
  let attackerFightersArr = Array.isArray(userArgs.attackerFighters) && userArgs.attackerFighters.every(num => typeof num === "number")
    ? userArgs.attackerFighters
    : [];
  let attackerBombersArr = Array.isArray(userArgs.attackerBombers) && userArgs.attackerBombers.every(num => typeof num === "number")
    ? userArgs.attackerBombers
    : [];

  let defenderBattleArray: number[] = []
  let i = 0
  let currentIndex = defenderFightersArr.length - 1

  while (defenderBattleArray.length < 25 && currentIndex >= 0) {
    if (defenderFightersArr[currentIndex] === 0) {
        currentIndex--
    }
    if (defenderFightersArr[currentIndex] > 0) {
        defenderBattleArray[i] = currentIndex + 1
        defenderFightersArr[currentIndex]--
        i++
    }
    if (currentIndex < 0) {
        break
    }
    }
    console.log(defenderBattleArray, "defenderBattleArray")

    let attackerBattleArray: number[] = []
    let j = 0;
    let currentIndex2 = attackerFightersArr.length - 1;

    while (attackerBattleArray.length < 25 && currentIndex2 >= 0) {
    if (attackerFightersArr[currentIndex2] === 0) {
        currentIndex2--
    }
    if (attackerFightersArr[currentIndex2] > 0) {
        attackerBattleArray[j] = currentIndex2 + 1
        attackerFightersArr[currentIndex2]--
        j++
    }
    if (currentIndex2 < 0) {
        break
    }
    }
    console.log(attackerBattleArray, "attackerBattleArray")

    let attackerBomberBattleArray: number[] = []
    let x = 0
    let currentIndex3 = attackerBombersArr.length - 1

    while (attackerBomberBattleArray.length < 25 && currentIndex3 >= 0) {
    if (attackerBombersArr[currentIndex3] === 0) {
        currentIndex3--
    }
    if (attackerBombersArr[currentIndex3] > 0) {
        attackerBomberBattleArray[x] = currentIndex3 + 1
        attackerBombersArr[currentIndex3]--
        x++
    }
    if (currentIndex3 < 0) {
        break
    }
    }
    console.log(attackerBomberBattleArray, "attackerBomberBattleArray")

    let defenderFightersInvolved = 0
    let attackerFightersInvolved = 0

    for (let k = 0; k < defenderBattleArray.length; k++) {
    if (defenderBattleArray[k] > 0) {
        defenderFightersInvolved += 1
    }
    }
    for (let l = 0; l < attackerBattleArray.length; l++) {
    if (attackerBattleArray[l] > 0) {
        attackerFightersInvolved += 1
    }
    }

    let totalFighersInvolved = defenderFightersInvolved + attackerFightersInvolved
    let casualties = Math.round(totalFighersInvolved * 0.3)
    console.log(casualties, "casualties")

    //calculate attacker fighter strength
    let attackerFighterStrength = 0
    for (let m = 0; m < attackerBattleArray.length; m++) {
    attackerFighterStrength += attackerBattleArray[m]
    }
    console.log(attackerFighterStrength, "attackerFighterStrength")
    let defenderFighterStrength = 0
    for (let n = 0; n < defenderBattleArray.length; n++) {
    defenderFighterStrength += defenderBattleArray[n]
    }
    console.log(defenderFighterStrength, "defenderFighterStrength")

    let totalStrength = attackerFighterStrength + defenderFighterStrength
    console.log(totalStrength, "totalStrength")

    let attackerBomberStrength = 0
    for (let y = 0; y < attackerBomberBattleArray.length; y++) {
    attackerBomberStrength += attackerBomberBattleArray[y]
    }
    console.log(attackerBomberStrength, "attackerBomberStrength")

    let numbers : number[] = []

    for (let i = 0; i < 50; i += 10) {
    const number = randomNumbers[2].toString().substring(i, i + 10)
    numbers.push(Number(number))
    }
    for (let i = 0; i < 50; i += 10) {
    const number = randomNumbers[3].toString().substring(i, i + 10)
    numbers.push(Number(number))
    }
    for (let i = 0; i < 50; i += 10) {
    const number = randomNumbers[4].toString().substring(i, i + 10)
    numbers.push(Number(number))
    }
    for (let i = 0; i < 50; i += 10) {
    const number = randomNumbers[5].toString().substring(i, i + 10)
    numbers.push(Number(number))
    }
    for (let i = 0; i < 50; i += 10) {
    const number = randomNumbers[6].toString().substring(i, i + 10)
    numbers.push(Number(number))
    }

    let attackerFighterCasualties : number [] = []
    let attackerBomberCasualties : number [] = []
    let defenderFighterCasualties : number [] = []
    let bomberDamage = 0

    for (let o = 0; o <= casualties; o++) {
    console.log(`dogfight ${o}`)
    var randomNumner = numbers[o]
    console.log(randomNumner, "randomNumner")
    var randomModulus = randomNumner % totalStrength
    console.log(randomModulus, "randomModulus")
    if (randomModulus < attackerFighterStrength) {
        console.log("attacker wins")
        //an attacker victory will result in a defender plane being lost and bomber damage inflicted (if bombers are present)
        var randomIndex = Math.floor(Math.random() * defenderFightersInvolved)
        if (defenderFightersInvolved = 0) {
          console.log("bombing")
        } else if (defenderFightersInvolved >= 1) {
          console.log(randomIndex, "randomIndex")
          console.log(defenderBattleArray[randomIndex], "type of defender fighter lost")
          defenderFighterCasualties.push(defenderBattleArray[randomIndex])
          if(defenderFighterStrength >= defenderBattleArray[randomIndex]) {
            defenderFighterStrength -= defenderBattleArray[randomIndex]
          } else if (defenderFighterStrength < defenderBattleArray[randomIndex]) {
            defenderFighterStrength = 0
          }
          totalStrength -= defenderBattleArray[randomIndex]
          defenderBattleArray[randomIndex] = 0
          console.log(defenderBattleArray, "defenderBattleArray")
          defenderBattleArray.splice(randomIndex, 1)
          defenderFightersInvolved -= 1
        }
        console.log(defenderFighterStrength, "new defenderFighterStrength")
        console.log(totalStrength, "new totalStrength")
        // defenderBattleArray[randomIndex] = defenderBattleArray[defenderBattleArray.length - 1];
        console.log(defenderFighterCasualties, "defenderFighterCasualties")
        //inflict bomber damage if bombers are present
        bomberDamage += attackerBomberStrength
        console.log(bomberDamage, "bomberDamage")
        console.log(attackerBomberStrength, "attackerBomberStrength")
      } else if (randomModulus >= attackerFighterStrength) {
        console.log("defender wins")
        //a defender victory in a dogfight will remove an attacker fighter and an attacker bomber
        var randomIndex = Math.floor(Math.random() * attackerFightersInvolved)
        console.log(randomIndex, "randomIndex")
        console.log(attackerBattleArray[randomIndex], "type of attacker fighter lost")
        attackerFighterCasualties.push(attackerBattleArray[randomIndex])
        if(attackerFighterStrength >= attackerBattleArray[randomIndex]) {
          attackerFighterStrength -= attackerBattleArray[randomIndex]
        } else if (attackerFighterStrength < attackerBattleArray[randomIndex]) {
          attackerFighterStrength = 0
        }
        console.log(attackerFighterStrength, "new attackerFighterStrength")
        totalStrength -= attackerBattleArray[randomIndex]
        console.log(totalStrength, "new totalStrength")
        attackerBattleArray[randomIndex] = 0
        // attackerBattleArray[randomIndex] = attackerBattleArray[attackerBattleArray.length - 1];
        attackerBattleArray.splice(randomIndex, 1)
        attackerFightersInvolved -= 1
        console.log(attackerBattleArray, "attackerBattleArray")
        console.log(attackerFighterCasualties, "attackerFighterCasualties")
        //remove bomber
        if (attackerBomberBattleArray.length > 0) {
        var randomIndexForBomber = Math.floor(Math.random() * attackerBomberBattleArray.length)
        console.log(randomIndexForBomber, "randomIndexForBomber")
        attackerBomberCasualties.push(attackerBomberBattleArray[randomIndexForBomber])
        console.log(attackerBomberCasualties, "attackerBomberCasualties")
        attackerBomberStrength -= attackerBomberBattleArray[randomIndexForBomber]
        console.log(attackerBomberStrength, "new attackerBomberStrength")
        attackerBomberBattleArray[randomIndexForBomber] = 0
        attackerBomberBattleArray.splice(randomIndexForBomber, 1)
        console.log(attackerBomberBattleArray, "attackerBomberBattleArray")
        }
      }
    }

    console.log("BATTLE RESULTS")
    console.log(attackerFighterCasualties, "attackerFighterCasualties")
    console.log(attackerBomberCasualties, "attackerBomberCasualties")
    console.log(defenderFighterCasualties, "defenderFighterCasualties")
    console.log(bomberDamage, "bomberDamage")

    const infrastructureDamage = Math.floor(bomberDamage / 10)
    const tankDamage = Math.floor(bomberDamage / 4)
    const cruiseMissileDamage = Math.floor(bomberDamage / 20)

  return {
    canExec: true,
    callData: [{
      to: airBattleAddress,
      data: airBattle.interface.encodeFunctionData("completeBattleSequence", [attackerFighterCasualties, attackerBomberCasualties, defenderFighterCasualties, attackerId, defenderId, infrastructureDamage, tankDamage, cruiseMissileDamage, battleId]),
    }],
  };
});