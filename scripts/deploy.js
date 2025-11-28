const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts...\n");

  // Get the deployer's address
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy MyToken with 1,000,000 initial supply
  const initialSupply = 1_000_000;
  console.log(`Deploying MyToken with ${initialSupply.toLocaleString()} initial supply...`);
  
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(initialSupply);
  await token.waitForDeployment();
  
  const tokenAddress = await token.getAddress();
  console.log("✅ MyToken deployed to:", tokenAddress);

  // Deploy Faucet with the token address
  console.log("\nDeploying Faucet...");
  
  const Faucet = await hre.ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy(tokenAddress);
  await faucet.waitForDeployment();
  
  const faucetAddress = await faucet.getAddress();
  console.log("✅ Faucet deployed to:", faucetAddress);

  // Transfer tokens to the faucet (500,000 tokens = half the supply)
  const faucetSupply = hre.ethers.parseEther("500000");
  console.log("\nTransferring 500,000 tokens to Faucet...");
  
  const transferTx = await token.transfer(faucetAddress, faucetSupply);
  await transferTx.wait();
  console.log("✅ Tokens transferred to Faucet");

  // Print summary
  console.log("\n" + "=".repeat(50));
  console.log("DEPLOYMENT COMPLETE");
  console.log("=".repeat(50));
  console.log("\n📋 Contract Addresses (save these!):\n");
  console.log(`   MyToken:  ${tokenAddress}`);
  console.log(`   Faucet:   ${faucetAddress}`);
  console.log("\n📝 Next steps:");
  console.log("   1. Copy these addresses to your frontend/index.html");
  console.log("   2. Open the frontend in your browser");
  console.log("   3. Connect MetaMask and claim some tokens!");
  console.log("\n💡 Add token to MetaMask:");
  console.log(`   Token Address: ${tokenAddress}`);
  console.log("   Symbol: MTK");
  console.log("   Decimals: 18");
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  