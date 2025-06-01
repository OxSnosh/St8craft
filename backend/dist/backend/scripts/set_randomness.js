"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const script_metadata_json_1 = __importDefault(require("../script-metadata.json"));
const hardhat_1 = require("hardhat");
let provider;
let signer;
async function setResources(taskArguments) {
    const signers = await hardhat_1.ethers.getSigners();
    let signer0PrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    provider = new hardhat_1.ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    signer = new hardhat_1.ethers.Wallet(signer0PrivateKey, provider);
    let resourcesAbi = script_metadata_json_1.default.HARDHAT.warbucks.ABI;
    let resourcesAddress = script_metadata_json_1.default.HARDHAT.warbucks.address;
    const resources = new hardhat_1.ethers.Contract(resourcesAddress, resourcesAbi, signer);
    // console.log(warbucks)
    await resources.mockResourcesForTesting(0, taskArguments[0], taskArguments[1]);
    console.log("resources set");
}
setResources({ 0: "value1", 1: "value2" });
