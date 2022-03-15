/* eslint-disable node/no-unsupported-features/es-syntax */
const setting = async function () {
  const hre = require("hardhat");
  const { expect } = require("chai");

  const contracts = {};

  const MyToken20 = await hre.ethers.getContractFactory("MyToken20");
  contracts.MyToken20 = await MyToken20.deploy();
  await contracts.MyToken20.deployed();

  const Airdrop = await hre.ethers.getContractFactory("Airdrop");
  contracts.Airdrop = await Airdrop.deploy(contracts.MyToken20.address);
  await contracts.Airdrop.deployed();

  const [owner, alice, bob, eve] = await hre.ethers.getSigners();

  const mash = {
    keccak256: hre.ethers.utils.solidityKeccak256,
    abi: {
      encodePacked: hre.ethers.utils.solidityPack,
    },
  };

  const signMsg = async (address, signer) => {
    const hash = mash.keccak256(
      ["bytes"],
      [
        mash.abi.encodePacked(
          ["string", "address"],
          ["verify(address _claimer)", address]
        ),
      ]
    );

    const digest = mash.keccak256(
      ["bytes"],
      [
        mash.abi.encodePacked(
          ["string", "bytes"],
          ["\x19Ethereum Signed Message:\n32", hash]
        ),
      ]
    );

    const signature = await hre.network.provider.send("eth_sign", [
      signer,
      hash,
    ]);

    const sig = hre.ethers.utils.splitSignature(signature);

    return {
      address: address,
      signer: signer,
      hash: hash,
      digest: digest,
      signature: signature,
      sig: sig,
    };
  };

  owner.signMessage = async (address) => {
    return signMsg(address, owner.address);
  };
  alice.signMessage = async (address) => {
    return signMsg(address, alice.address);
  };
  bob.signMessage = async (address) => {
    return signMsg(address, bob.address);
  };
  eve.signMessage = async (address) => {
    return signMsg(address, eve.address);
  };

  const mapExecutorToMyToken20 = async (executor) => {
    return new hre.ethers.Contract(
      contracts.MyToken20.address,
      contracts.MyToken20.interface,
      executor
    );
  };

  const mapExecutorToAirdrop = async (executor) => {
    return new hre.ethers.Contract(
      contracts.Airdrop.address,
      contracts.Airdrop.interface,
      executor
    );
  };

  const accounts = {
    owner: {
      ...owner,
      MyToken20: await mapExecutorToMyToken20(owner),
      Airdrop: await mapExecutorToAirdrop(owner),
    },
    alice: {
      ...alice,
      MyToken20: await mapExecutorToMyToken20(alice),
      Airdrop: await mapExecutorToAirdrop(alice),
    },
    bob: {
      ...bob,
      MyToken20: await mapExecutorToMyToken20(bob),
      Airdrop: await mapExecutorToAirdrop(bob),
    },
    eve: {
      ...eve,
      MyToken20: await mapExecutorToMyToken20(eve),
      Airdrop: await mapExecutorToAirdrop(eve),
    },
  };

  const symbol = "MT20";
  const name = "My Token 20";
  const totalSupply = 10000000;
  const decimals = 18;

  return {
    symbol,
    name,
    totalSupply,
    decimals,
    hre,
    expect,
    accounts,
    contracts,
  };
};

module.exports = {
  setting,
};
