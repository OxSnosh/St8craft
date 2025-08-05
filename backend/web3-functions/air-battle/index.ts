import { Web3Function, Web3FunctionContext } from "@gelatonetwork/web3-functions-sdk";
import { Contract, Interface, JsonRpcProvider } from "ethers";

const ORACLE_ABI = [
  "function completeAirBattle(uint256[], uint256[], uint256[], uint256, uint256, uint256, uint256, uint256, uint256)",
];

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { multiChainProvider } = context;
  const provider = new JsonRpcProvider("https://sepolia.base.org")

  const airBattleAddress = "0x8fAb6834e53709FAC63c13348a7942C58A178Bce";
  const airBattle = new Contract(airBattleAddress, ORACLE_ABI, provider);

  const AIR_BATTLE_ABI = [
    "event AirBattleRequested(uint256 battleId, uint256 attackerId, uint256 defenderId, uint256[] randomWords, uint256[] attackerFighters, uint256[] attackerBombers, uint256[] defenderFighters, uint256 timestamp)"
  ];

  const iface = new Interface(AIR_BATTLE_ABI);
  const latestBlock = await provider.getBlockNumber();

  const logs = await provider.getLogs({
    address: airBattleAddress,
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
    .filter((e) => e?.name === "AirBattleRequested");

  if (parsedEvents.length === 0) throw new Error("No AirBattleRequested events found");

  const event = parsedEvents[parsedEvents.length - 1];

  if (!event) {
    throw new Error("No valid AirBattleRequested event found");
  }

  const battleId = Number(event.args.battleId);
  const attackerId = Number(event.args.attackerId);
  const defenderId = Number(event.args.defenderId);
  const randomNumbers = event.args.randomWords.map((n: bigint) => BigInt(n));
  const attackerFightersArr = event.args.attackerFighters.map((n: bigint) => Number(n));
  const attackerBombersArr = event.args.attackerBombers.map((n: bigint) => Number(n));
  const defenderFightersArr = event.args.defenderFighters.map((n: bigint) => Number(n));

  // console.log(battleId, "battleId");
  // console.log(attackerId, "attackerId");
  // console.log(defenderId, "defenderId");
  // console.log(randomNumbers, "randomNumbers");
  // console.log(attackerFightersArr, "attackerFightersArr");
  // console.log(attackerBombersArr, "attackerBombersArr");
  // console.log(defenderFightersArr, "defenderFightersArr");

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
    // console.log(defenderBattleArray, "defenderBattleArray")

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
    // console.log(attackerBattleArray, "attackerBattleArray")

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
    // console.log(attackerBomberBattleArray, "attackerBomberBattleArray")

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
    // console.log(casualties, "casualties")

    //calculate attacker fighter strength
    let attackerFighterStrength = 0
    for (let m = 0; m < attackerBattleArray.length; m++) {
    attackerFighterStrength += attackerBattleArray[m]
    }
    // console.log(attackerFighterStrength, "attackerFighterStrength")
    let defenderFighterStrength = 0
    for (let n = 0; n < defenderBattleArray.length; n++) {
    defenderFighterStrength += defenderBattleArray[n]
    }
    // console.log(defenderFighterStrength, "defenderFighterStrength")

    let totalStrength = attackerFighterStrength + defenderFighterStrength
    // console.log(totalStrength, "totalStrength")

    let attackerBomberStrength = 0
    for (let y = 0; y < attackerBomberBattleArray.length; y++) {
    attackerBomberStrength += attackerBomberBattleArray[y]
    }
    // console.log(attackerBomberStrength, "attackerBomberStrength")

    let numbers : number[] = []

    for (let i = 0; i < 50; i += 10) {
      const number = String(randomNumbers[2]).substring(i, i + 10)
      numbers.push(Number(number))
    }
        for (let i = 0; i < 50; i += 10) {
      const number = String(randomNumbers[3]).substring(i, i + 10)
      numbers.push(Number(number))
    }
        for (let i = 0; i < 50; i += 10) {
      const number = String(randomNumbers[4]).substring(i, i + 10)
      numbers.push(Number(number))
    }
        for (let i = 0; i < 50; i += 10) {
      const number = String(randomNumbers[5]).substring(i, i + 10)
      numbers.push(Number(number))
    }
        for (let i = 0; i < 50; i += 10) {
      const number = String(randomNumbers[6]).substring(i, i + 10)
      numbers.push(Number(number))
    }
    // console.log(numbers, "numbers")

    let attackerFighterCasualties : number [] = []
    let attackerBomberCasualties : number [] = []
    let defenderFighterCasualties : number [] = []
    let bomberDamage = 0

    for (let o = 0; o <= casualties; o++) {
    // console.log(`dogfight ${o}`)
    var randomNumner = numbers[o]
    // console.log(randomNumner, "randomNumner")
    var randomModulus = randomNumner % totalStrength
    // console.log(randomModulus, "randomModulus")
    if (randomModulus < attackerFighterStrength) {
        // console.log("attacker wins")
        //an attacker victory will result in a defender plane being lost and bomber damage inflicted (if bombers are present)
        var randomIndex = Math.floor(Math.random() * defenderFightersInvolved)
        if (defenderFightersInvolved === 0) {
          // console.log("bombing")
        } else if (defenderFightersInvolved >= 1) {
          // console.log(randomIndex, "randomIndex")
          // console.log(defenderBattleArray[randomIndex], "type of defender fighter lost")
          defenderFighterCasualties.push(defenderBattleArray[randomIndex])
          if(defenderFighterStrength >= defenderBattleArray[randomIndex]) {
            defenderFighterStrength -= defenderBattleArray[randomIndex]
          } else if (defenderFighterStrength < defenderBattleArray[randomIndex]) {
            defenderFighterStrength = 0
          }
          totalStrength -= defenderBattleArray[randomIndex]
          defenderBattleArray[randomIndex] = 0
          // console.log(defenderBattleArray, "defenderBattleArray")
          defenderBattleArray.splice(randomIndex, 1)
          defenderFightersInvolved -= 1
        }
        // console.log(defenderFighterStrength, "new defenderFighterStrength")
        // console.log(totalStrength, "new totalStrength")
        // console.log(defenderFighterCasualties, "defenderFighterCasualties")
        //inflict bomber damage if bombers are present
        bomberDamage += attackerBomberStrength
        // console.log(bomberDamage, "bomberDamage")
        // console.log(attackerBomberStrength, "attackerBomberStrength")
      } else if (randomModulus >= attackerFighterStrength) {
        // console.log("defender wins")
        //a defender victory in a dogfight will remove an attacker fighter and an attacker bomber
        var randomIndex = Math.floor(Math.random() * attackerFightersInvolved)
        // console.log(randomIndex, "randomIndex")
        // console.log(attackerBattleArray[randomIndex], "type of attacker fighter lost")
        attackerFighterCasualties.push(attackerBattleArray[randomIndex])
        if(attackerFighterStrength >= attackerBattleArray[randomIndex]) {
          attackerFighterStrength -= attackerBattleArray[randomIndex]
        } else if (attackerFighterStrength < attackerBattleArray[randomIndex]) {
          attackerFighterStrength = 0
        }
        // console.log(attackerFighterStrength, "new attackerFighterStrength")
        totalStrength -= attackerBattleArray[randomIndex]
        // console.log(totalStrength, "new totalStrength")
        attackerBattleArray[randomIndex] = 0
        // attackerBattleArray[randomIndex] = attackerBattleArray[attackerBattleArray.length - 1];
        attackerBattleArray.splice(randomIndex, 1)
        attackerFightersInvolved -= 1
        // console.log(attackerBattleArray, "attackerBattleArray")
        // console.log(attackerFighterCasualties, "attackerFighterCasualties")
        //remove bomber
        if (attackerBomberBattleArray.length > 0) {
        var randomIndexForBomber = Math.floor(Math.random() * attackerBomberBattleArray.length)
        // console.log(randomIndexForBomber, "randomIndexForBomber")
        attackerBomberCasualties.push(attackerBomberBattleArray[randomIndexForBomber])
        // console.log(attackerBomberCasualties, "attackerBomberCasualties")
        attackerBomberStrength -= attackerBomberBattleArray[randomIndexForBomber]
        // console.log(attackerBomberStrength, "new attackerBomberStrength")
        attackerBomberBattleArray[randomIndexForBomber] = 0
        attackerBomberBattleArray.splice(randomIndexForBomber, 1)
        // console.log(attackerBomberBattleArray, "attackerBomberBattleArray")
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

    console.log(infrastructureDamage, "infrastructureDamage")
    console.log(tankDamage, "tankDamage")
    console.log(cruiseMissileDamage, "cruiseMissileDamage")
    console.log(battleId, "battleId")

  return {
    canExec: true,
    callData: [{
      to: airBattleAddress,
      data: airBattle.interface.encodeFunctionData("completeAirBattle", [attackerFighterCasualties, attackerBomberCasualties, defenderFighterCasualties, attackerId, defenderId, infrastructureDamage, tankDamage, cruiseMissileDamage, battleId]),
    }],
  };
});