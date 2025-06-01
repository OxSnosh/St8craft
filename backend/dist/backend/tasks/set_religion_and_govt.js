"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const script_metadata_json_1 = __importDefault(require("../script-metadata.json"));
const ethers_1 = require("ethers");
(0, config_1.task)("set-religion-and-govt", "Sets desired religion and government for a nation")
    .addParam("nationid", "The nation ID")
    .addParam("religion", "The first resource value")
    .addParam("government", "The second resource value")
    .setAction(async (taskArgs, hre) => {
    console.log("Task arguments:", taskArgs); // Debug log
    const provider = new ethers_1.ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    const signer0PrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const signer = new ethers_1.ethers.Wallet(signer0PrivateKey, provider);
    const countryParametersAbi = script_metadata_json_1.default.HARDHAT.countryparameterscontract.ABI;
    const countryParametersAddress = script_metadata_json_1.default.HARDHAT.countryparameterscontract.address;
    const parameters = new ethers_1.ethers.Contract(countryParametersAddress, countryParametersAbi, signer);
    // Check if arguments are valid numbers
    const religion = ethers_1.ethers.BigNumber.from(taskArgs.religion);
    const government = ethers_1.ethers.BigNumber.from(taskArgs.government);
    const nationId = ethers_1.ethers.BigNumber.from(taskArgs.nationid);
    await parameters.setDesiredReligionAndGovernmentFromOwner(nationId, religion, government);
    console.log(`Desired religion and governement for nation ${nationId} set to: ${religion}, ${government}`);
});
