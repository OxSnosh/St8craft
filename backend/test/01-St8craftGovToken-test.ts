//St8kraft © 2022 by OxSnosh is licensed under Attribution-NonCommercial-NoDerivatives 4.0 International
import { expect } from "chai"
import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { INITIAL_SUPPLY } from "../helper-hardhat-config"
import { St8craftGovToken } from "../typechain-types"
import { TreasuryContract } from '../typechain-types/contracts/Treasury.sol/TreasuryContract';
import { CountryMinter } from '../typechain-types/contracts/CountryMinter';

describe("St8craftGovToken", function () {

  let st8craftgovtoken: St8craftGovToken
  let treasuryContract: TreasuryContract
  let countryMinter: CountryMinter

  let signer0: SignerWithAddress
  let signer1: SignerWithAddress
  let signer2: SignerWithAddress
  let signers: SignerWithAddress[]

  beforeEach(async function () {

      signers = await ethers.getSigners();
      signer0 = signers[0];
      signer1 = signers[1];
      signer2 = signers[2];
  
      const MetaNatonsGovToken = await ethers.getContractFactory(
          "MetaNationsGovToken"
      )
      st8craftgovtoken = await MetaNatonsGovToken.deploy(INITIAL_SUPPLY) as St8craftGovToken
      await st8craftgovtoken.deployed()
      // console.log(`MetaNationsGovToken deployed to ${metanationsgovtoken.address}`)


  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await st8craftgovtoken.owner()).to.equal(signer0.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await st8craftgovtoken.balanceOf(signer0.address);
      expect(await st8craftgovtoken.totalSupply()).to.equal(ownerBalance);
    });

    it("Tests that ownership can ba transferred correctly", async function () {
        await st8craftgovtoken.connect(signer0).transferOwnership(signer1.address);
        const owner = await st8craftgovtoken.owner();
        expect(owner).to.equal(signer1.address);
    })
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {

      await st8craftgovtoken.transfer(signer1.address, 50);
      const addr1Balance = await st8craftgovtoken.balanceOf(signer1.address);
      expect(addr1Balance).to.equal(50);

      await st8craftgovtoken.connect(signer1).transfer(signer2.address, 50);
      const addr2Balance = await st8craftgovtoken.balanceOf(signer2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      await expect(
        st8craftgovtoken.connect(signer1).transfer(signer0.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await st8craftgovtoken.balanceOf(signer0.address);

      await st8craftgovtoken.transfer(signer1.address, 100);

      await st8craftgovtoken.transfer(signer2.address, 50);

      const finalOwnerBalance = await st8craftgovtoken.balanceOf(signer0.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await st8craftgovtoken.balanceOf(signer1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await st8craftgovtoken.balanceOf(signer2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});