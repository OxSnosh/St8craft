import process from "process";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import { ethers } from "ethers";
import * as metadata from "../Contracts/contract-metadata.json";
import dotenv from "dotenv";
import { GroundBattleContract } from '../../typechain-types/contracts/GroundBattle.sol/GroundBattleContract';
import { request } from "http";
dotenv.config();

type EAInput = {
  id: number;
  data: {
    attackId: number;
    randomWords: string,
    attackerStrength: number,
    defenderStrength: number,
    attackerId: number,
    defenderId: number,
    warId: number 
  };
};

type EAOutput = {
  jobRunId: string | number;
  statusCode: number;
  data: {
    attackId: number;
    attackerId: number;
    attackerSoldierLosses: number;
    attackerTankLosses: number;
    defenderId: number;
    defenderSoldierLosses: number;
    defenderTankLosses: number;
    warId: number;
    attackVictory: boolean;
  };
  error?: string;
};

const PORT = 8087;
const app: Express = express();

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Ground Battle Running");
});

app.post("/", async function (req: Request<{}, {}, EAInput>, res: Response) {
    const eaInputData: EAInput = req.body;
    console.log(" Request data received: ", eaInputData);

    let jobRunId = eaInputData.id;

    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");

    const signer0 = provider.getSigner(0)
    const signer1 = provider.getSigner(1)
    const signer1Address = await signer1.getAddress();
    // const signer2 = provider.getSigner(2)

    const GroundBattleContractAddress = metadata.HARDHAT.groundbattlecontract.address;
    const GroundBattleContractAbi = metadata.HARDHAT.groundbattlecontract.ABI;
    const groundBattleContract = new ethers.Contract(GroundBattleContractAddress, GroundBattleContractAbi, provider) as GroundBattleContract
    
    function decodeBase64ToBigIntArray(base64String : string) {
          // Decode the Base64 string to a Buffer
          const buffer = Buffer.from(base64String, 'base64');
      
          // Define the size of each 256-bit number (32 bytes)
          const chunkSize = 32;
      
          // Start processing from the first valid 32-byte chunk
          const startIndex = buffer.length % chunkSize;
      
          // Extract the 32-byte chunks as BigInt values
          const bigIntArray = [];
          for (let i = startIndex; i < buffer.length; i += chunkSize) {
              const chunk = buffer.subarray(i, i + chunkSize); // Get a 32-byte chunk
              const bigIntValue = BigInt(`0x${chunk.toString('hex')}`); // Convert the chunk to BigInt
              bigIntArray.push(bigIntValue);
          }
      
          // Return only the first 10 numbers
          return bigIntArray.slice(2, 12);
      }

    const requestNumber = eaInputData.data.attackId  
    const randomNumbers = decodeBase64ToBigIntArray(eaInputData.data.randomWords)
    const attackerStrength = eaInputData.data.attackerStrength
    const defenderStrength = eaInputData.data.defenderStrength
    const attackerId = eaInputData.data.attackerId
    const defenderId = eaInputData.data.defenderId
    const warId = eaInputData.data.warId

    const totalStrength = attackerStrength + defenderStrength
    const battleOutcomeNumber : any = BigInt(randomNumbers[0]) % BigInt(totalStrength)
    console.log("battleOutcomeNumber: ", battleOutcomeNumber.toString())

    const attackerVictory = battleOutcomeNumber < attackerStrength
    console.log("attackerVictory: ", attackerVictory)

    let attackerSoldierLosses = 0
    let attackerTankLosses = 0
    let defenderSoldierLosses = 0
    let defenderTankLosses = 0

    console.log("requestNumber", requestNumber)
    console.log("attack Id", eaInputData.data.attackId)
 
    if (attackerVictory) {
        const results = await groundBattleContract.attackVictory(requestNumber)
        console.log("results", results)
        attackerSoldierLosses = results[0].toNumber()
        attackerTankLosses = results[1].toNumber()
        defenderSoldierLosses = results[2].toNumber()
        defenderTankLosses = results[3].toNumber()
      } else {
        const results = await groundBattleContract.defenseVictory(requestNumber)
        console.log("results", results)
        attackerSoldierLosses = results[0].toNumber()
        attackerTankLosses = results[1].toNumber()
        defenderSoldierLosses = results[2].toNumber()
        defenderTankLosses = results[3].toNumber()
    }
  
    let eaResponse: EAOutput = {
        data: {
            attackId: requestNumber,
            attackerId: attackerId,
            attackerSoldierLosses: attackerSoldierLosses,
            attackerTankLosses: attackerTankLosses,
            defenderId: defenderId,
            defenderSoldierLosses: defenderSoldierLosses,
            defenderTankLosses: defenderTankLosses,
            warId: warId,
            attackVictory: attackerVictory
        },
        jobRunId: eaInputData.id,
        statusCode: 0,
    };

    try {
        eaResponse.jobRunId = jobRunId;
        eaResponse.data.attackId = requestNumber;
        eaResponse.data.attackerId = attackerId;
        eaResponse.data.attackerSoldierLosses = attackerSoldierLosses;
        eaResponse.data.attackerTankLosses = attackerTankLosses;
        eaResponse.data.defenderId = defenderId;
        eaResponse.data.defenderSoldierLosses = defenderSoldierLosses;
        eaResponse.data.defenderTankLosses = defenderTankLosses;
        eaResponse.data.warId = warId;
        eaResponse.data.attackVictory = attackerVictory;
        eaResponse.statusCode = 200;
        res.json(eaResponse);
    } catch (error: any) {
        console.error(error);
        eaResponse.error = error.message;
        eaResponse.statusCode = 400;
        res.json(eaResponse);
    }

    console.log("returned response:  ", eaResponse);
    return;
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

process.on("SIGINT", () => {
    console.info("\nShutting down server...");
    process.exit(0);
});