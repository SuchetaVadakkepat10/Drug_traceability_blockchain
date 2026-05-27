import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts...");

  // Deploy BatchNFT
  const BatchNFT = await ethers.getContractFactory("BatchNFT");
  const batchNFT = await BatchNFT.deploy();
  await batchNFT.waitForDeployment();
  console.log("BatchNFT deployed to:", await batchNFT.getAddress());

  // Deploy UnitNFT
  const UnitNFT = await ethers.getContractFactory("UnitNFT");
  const unitNFT = await UnitNFT.deploy();
  await unitNFT.waitForDeployment();
  console.log("UnitNFT deployed to:", await unitNFT.getAddress());

  // Set cross-references and WAIT for transactions
  console.log("Setting cross-references...");
  
  const tx1 = await batchNFT.setUnitNFT(await unitNFT.getAddress());
  await tx1.wait(); // Wait for transaction to be mined
  console.log("BatchNFT.setUnitNFT completed");

  const tx2 = await unitNFT.setBatchNFT(await batchNFT.getAddress());
  await tx2.wait(); // Wait for transaction to be mined
  console.log("UnitNFT.setBatchNFT completed");

  console.log("\n=== Deployment Complete ===");
  console.log("BatchNFT:", await batchNFT.getAddress());
  console.log("UnitNFT:", await unitNFT.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});