"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const script_metadata_json_1 = __importDefault(require("../script-metadata.json"));
const ethers_1 = require("ethers");
(0, config_1.task)("set-resources", "Sets mock resources for testing")
    .addParam("nationid", "The nation ID")
    .addParam("resource1", "The first resource value")
    .addParam("resource2", "The second resource value")
    .setAction(async (taskArgs, hre) => {
    console.log("Task arguments:", taskArgs); // Debug log
    const provider = new ethers_1.ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    const signer0PrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const signer = new ethers_1.ethers.Wallet(signer0PrivateKey, provider);
    const resourcesAbi = script_metadata_json_1.default.HARDHAT.resourcescontract.ABI;
    const resourcesAddress = script_metadata_json_1.default.HARDHAT.resourcescontract.address;
    const resources = new ethers_1.ethers.Contract(resourcesAddress, resourcesAbi, signer);
    // Check if arguments are valid numbers
    const resource1 = ethers_1.ethers.BigNumber.from(taskArgs.resource1);
    const resource2 = ethers_1.ethers.BigNumber.from(taskArgs.resource2);
    const nationId = ethers_1.ethers.BigNumber.from(taskArgs.nationid);
    await resources.mockResourcesForTesting(nationId, resource1, resource2);
    console.log(`Resources for nation ${nationId} set to: ${resource1}, ${resource2}`);
});
