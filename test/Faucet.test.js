const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20 Faucet", function () {
  let token;
  let faucet;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy token with 1 million supply
    const MyToken = await ethers.getContractFactory("MyToken");
    token = await MyToken.deploy(1_000_000);
    await token.waitForDeployment();

    // Deploy faucet
    const Faucet = await ethers.getContractFactory("Faucet");
    faucet = await Faucet.deploy(await token.getAddress());
    await faucet.waitForDeployment();

    // Transfer tokens to faucet
    const faucetAmount = ethers.parseEther("100000");
    await token.transfer(await faucet.getAddress(), faucetAmount);
  });

  describe("MyToken", function () {
    it("should have correct name and symbol", async function () {
      expect(await token.name()).to.equal("MyToken");
      expect(await token.symbol()).to.equal("MTK");
    });

    it("should mint initial supply to deployer", async function () {
      const expectedSupply = ethers.parseEther("1000000");
      const ownerBalance = await token.balanceOf(owner.address);
      const faucetBalance = await token.balanceOf(await faucet.getAddress());
      
      // Owner has initial supply minus what was sent to faucet
      expect(ownerBalance + faucetBalance).to.equal(expectedSupply);
    });

    it("should have 18 decimals", async function () {
      expect(await token.decimals()).to.equal(18);
    });
  });

  describe("Faucet", function () {
    it("should store the correct token address", async function () {
      expect(await faucet.token()).to.equal(await token.getAddress());
    });

    it("should allow users to claim tokens", async function () {
      const claimAmount = await faucet.claimAmount();
      
      // User1 claims tokens
      await faucet.connect(user1).claim();
      
      const userBalance = await token.balanceOf(user1.address);
      expect(userBalance).to.equal(claimAmount);
    });

    it("should prevent claiming before cooldown", async function () {
      // First claim should succeed
      await faucet.connect(user1).claim();
      
      // Second claim should fail
      await expect(
        faucet.connect(user1).claim()
      ).to.be.revertedWith("Please wait before claiming again");
    });

    it("should allow claiming after cooldown", async function () {
      // First claim
      await faucet.connect(user1).claim();
      
      // Fast forward time by 24 hours
      await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
      
      // Second claim should succeed
      await faucet.connect(user1).claim();
      
      const claimAmount = await faucet.claimAmount();
      const expectedBalance = claimAmount * 2n; // Two claims
      expect(await token.balanceOf(user1.address)).to.equal(expectedBalance);
    });

    it("should correctly report if user can claim", async function () {
      // User can claim initially
      expect(await faucet.canClaim(user1.address)).to.be.true;
      
      // After claiming, they cannot
      await faucet.connect(user1).claim();
      expect(await faucet.canClaim(user1.address)).to.be.false;
    });

    it("should report correct time until next claim", async function () {
      // Before first claim, should be 0
      expect(await faucet.timeUntilNextClaim(user1.address)).to.equal(0);
      
      // After claiming, should be close to 24 hours
      await faucet.connect(user1).claim();
      const timeRemaining = await faucet.timeUntilNextClaim(user1.address);
      
      // Should be approximately 24 hours (allow small variance for block time)
      expect(timeRemaining).to.be.closeTo(24 * 60 * 60, 5);
    });

    it("should only allow owner to withdraw", async function () {
      const withdrawAmount = ethers.parseEther("1000");
      
      // Non-owner cannot withdraw
      await expect(
        faucet.connect(user1).withdraw(withdrawAmount)
      ).to.be.revertedWith("Only owner can call this");
      
      // Owner can withdraw
      await faucet.connect(owner).withdraw(withdrawAmount);
    });

    it("should emit event on claim", async function () {
      const claimAmount = await faucet.claimAmount();
      
      await expect(faucet.connect(user1).claim())
        .to.emit(faucet, "TokensClaimed")
        .withArgs(user1.address, claimAmount);
    });
  });
});
