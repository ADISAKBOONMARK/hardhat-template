const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const MyToken20 = await hre.ethers.getContractFactory("MyToken20");
  const myToken20 = await MyToken20.deploy();
  await myToken20.deployed();

  console.log("MyToken20 deployed to:", myToken20.address);

  const Airdrop = await hre.ethers.getContractFactory("Airdrop");
  const airdrop = await Airdrop.deploy(myToken20.address);
  await airdrop.deployed();

  console.log("Airdrop deployed to:", airdrop.address);

  // write address to file
  const obj = {
    myToken20: myToken20,
    airdrop: airdrop,
  };

  try {
    fs.writeFileSync("artifacts/deployed.json", JSON.stringify(obj, null, 2));
  } catch (err) {
    console.error(err);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
