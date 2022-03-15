/* eslint-disable eqeqeq */
let config = require("../config/IConfig.test");

describe("Integrat", async function () {
  before(async () => {
    const _config = require("../config/Config.test.js");
    config = await _config.setting();
    config.totalAirdrop = 1000;
    config.claimAmount = {
      alice: 100,
      bob: 100,
    };
  });

  it("Can transfer token from owner to airdrop contract", async function () {
    await config.accounts.owner.MyToken20.transfer(
      config.accounts.owner.Airdrop.address,
      config.hre.ethers.utils.parseUnits(
        config.totalAirdrop.toString(),
        config.decimals
      )
    );

    let balance = await config.accounts.owner.MyToken20.balanceOf(
      config.accounts.owner.address
    );

    config
      .expect(
        config.hre.ethers.utils.formatEther(balance) ==
          config.totalSupply - 1000
      )
      .to.equal(true, "001");

    balance = await config.accounts.owner.MyToken20.balanceOf(
      config.contracts.Airdrop.address
    );

    config
      .expect(
        config.hre.ethers.utils.formatEther(balance) == config.totalAirdrop
      )
      .to.equal(true, "002");
  });

  it("Can claim by amount", async function () {
    let signMsg = await config.accounts.owner.signMessage(
      config.accounts.alice.address
    );

    await config.accounts.alice.Airdrop.claim(
      signMsg.sig.v,
      signMsg.sig.r,
      signMsg.sig.s,
      config.accounts.alice.address,
      config.hre.ethers.utils.parseUnits(
        config.claimAmount.alice.toString(),
        config.decimals
      )
    );

    signMsg = await config.accounts.owner.signMessage(
      config.accounts.bob.address
    );

    await config.accounts.bob.Airdrop.claim(
      signMsg.sig.v,
      signMsg.sig.r,
      signMsg.sig.s,
      config.accounts.bob.address,
      config.hre.ethers.utils.parseUnits(
        config.claimAmount.bob.toString(),
        config.decimals
      )
    );

    let balance = await config.accounts.owner.MyToken20.balanceOf(
      config.accounts.alice.address
    );

    config
      .expect(
        config.hre.ethers.utils.formatEther(balance) == config.claimAmount.alice
      )
      .to.equal(true, "001");

    balance = await config.accounts.owner.MyToken20.balanceOf(
      config.accounts.bob.address
    );

    config
      .expect(
        config.hre.ethers.utils.formatEther(balance) == config.claimAmount.bob
      )
      .to.equal(true, "002");

    balance = await config.accounts.owner.MyToken20.balanceOf(
      config.contracts.Airdrop.address
    );

    config
      .expect(
        config.hre.ethers.utils.formatEther(balance) ==
          config.totalAirdrop -
            (config.claimAmount.alice + config.claimAmount.bob)
      )
      .to.equal(true, "003");
  });
});
