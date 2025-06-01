"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const script_metadata_json_1 = __importDefault(require("../script-metadata.json"));
const hardhat_1 = require("hardhat");
let provider;
let signer;
async function transferSomeWarbucks() {
    const signers = await hardhat_1.ethers.getSigners();
    let signer0PrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    provider = new hardhat_1.ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    signer = new hardhat_1.ethers.Wallet(signer0PrivateKey, provider);
    let warbucksAbi = script_metadata_json_1.default.HARDHAT.warbucks.ABI;
    let warbucksAddress = script_metadata_json_1.default.HARDHAT.warbucks.address;
    const warbucks = new hardhat_1.ethers.Contract(warbucksAddress, warbucksAbi, signer);
    // console.log(warbucks)
    await warbucks.approve(signers[0].address, BigInt(400000000 * 10 ** 18));
    await warbucks.transferFrom(signers[0].address, "0xe50F61E239Da564254B9173b6e486AC883e3A249", BigInt(400000000 * 10 ** 18));
    console.log("transfer!");
}
transferSomeWarbucks();
