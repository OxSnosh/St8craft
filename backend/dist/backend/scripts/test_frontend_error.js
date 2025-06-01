"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const script_metadata_json_1 = __importDefault(require("../script-metadata.json"));
const hardhat_1 = require("hardhat");
let provider;
let signer;
async function testFrontEndError() {
    const signers = await hardhat_1.ethers.getSigners(); // Hardhat Signers
    // Manually create provider and wallets
    let signer0PrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    let signer1PrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
    provider = new hardhat_1.ethers.providers.JsonRpcProvider("http://localhost:8545/");
    const wallet0 = new hardhat_1.ethers.Wallet(signer0PrivateKey, provider); // Signer 0
    const wallet1 = new hardhat_1.ethers.Wallet(signer1PrivateKey, provider); // Signer 1
    // Warbucks Contract
    let warbucksAbi = script_metadata_json_1.default.HARDHAT.warbucks.ABI;
    let warbucksAddress = script_metadata_json_1.default.HARDHAT.warbucks.address;
    const warbucks = new hardhat_1.ethers.Contract(warbucksAddress, warbucksAbi, wallet0);
    console.log((await warbucks.balanceOf(wallet0.address)).toString()); // Log Wallet 1 balance
    // Approve and transfer funds
    await warbucks.approve(wallet0.address, BigInt(4000000 * 10 ** 18));
    await warbucks.transferFrom(wallet0.address, wallet1.address, BigInt(4000000 * 10 ** 18));
    console.log((await warbucks.balanceOf(wallet1.address)).toString()); // Log Wallet 1 balance
    // CountryMinter Contract
    let countryMinterAbi = script_metadata_json_1.default.HARDHAT.countryminter.ABI;
    let countryMinterAddress = script_metadata_json_1.default.HARDHAT.countryminter.address;
    const countryMinter = new hardhat_1.ethers.Contract(countryMinterAddress, countryMinterAbi, wallet1);
    // Call generateCountry
    await countryMinter.generateCountry("Ruler", "Flag", "Description", "Text");
}
testFrontEndError().catch((err) => {
    console.error(err);
});
