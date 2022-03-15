/* eslint-disable eqeqeq */
let config = require("../config/IConfig.test");

describe("MyToken20", async function () {
  beforeEach(async () => {
    const _config = require("../config/Config.test.js");
    config = await _config.setting();
  });

  it("Can check name", async function () {
    const name = await config.accounts.owner.MyToken20.name();

    config.expect(name == config.name).to.equal(true, "001");
  });

  it("Can check symbol", async function () {
    const symbol = await config.accounts.owner.MyToken20.symbol();

    config.expect(symbol == config.symbol).to.equal(true, "001");
  });

  it("Can check total supply", async function () {
    const totalSupply = await config.accounts.owner.MyToken20.totalSupply();

    config
      .expect(
        config.hre.ethers.utils.formatEther(totalSupply) == config.totalSupply
      )
      .to.equal(true, "001");
  });

  it("Can check balanceOf", async function () {
    const balance = await config.accounts.owner.MyToken20.balanceOf(
      config.accounts.owner.address
    );

    config
      .expect(
        config.hre.ethers.utils.formatEther(balance) == config.totalSupply
      )
      .to.equal(true, "001");
  });

  it("Can check owner", async function () {
    const owner = await config.accounts.owner.MyToken20.owner();

    config.expect(owner == config.accounts.owner.address).to.equal(true, "001");
  });

  it("Can check pause", async function () {
    const pause = await config.accounts.owner.MyToken20.paused();

    config.expect(pause == false).to.equal(true, "001");
  });

  it("Can pause", async function () {
    await config.accounts.owner.MyToken20.pause();
    const pause = await config.accounts.owner.MyToken20.paused();

    config.expect(pause == true).to.equal(true, "001");
  });

  it("Can unpause", async function () {
    await config.accounts.owner.MyToken20.pause();
    await config.accounts.owner.MyToken20.unpause();
    const pause = await config.accounts.owner.MyToken20.paused();

    config.expect(pause == false).to.equal(true, "001");
  });

  it("Should allow only owner role to pause", async function () {
    await config
      .expect(config.accounts.alice.MyToken20.pause())
      .revertedWith("Ownable: caller is not the owner");
  });

  it("Should allow only owner role to unpause", async function () {
    await config.accounts.owner.MyToken20.pause();
    await config
      .expect(config.accounts.alice.MyToken20.unpause())
      .revertedWith("Ownable: caller is not the owner");
  });

  it("Can approve token to another address", async function () {
    await config.accounts.owner.MyToken20.approve(
      config.accounts.alice.address,
      config.hre.ethers.utils.parseUnits("10", config.decimals)
    );

    const amount = await config.accounts.owner.MyToken20.allowance(
      config.accounts.owner.address,
      config.accounts.alice.address
    );

    config
      .expect(config.hre.ethers.utils.formatEther(amount) == 10)
      .to.equal(true, "001");
  });

  it("Can increase token approval to another address", async function () {
    await config.accounts.owner.MyToken20.approve(
      config.accounts.alice.address,
      config.hre.ethers.utils.parseUnits("10", config.decimals)
    );
    await config.accounts.owner.MyToken20.increaseAllowance(
      config.accounts.alice.address,
      config.hre.ethers.utils.parseUnits("10", config.decimals)
    );

    const amount = await config.accounts.owner.MyToken20.allowance(
      config.accounts.owner.address,
      config.accounts.alice.address
    );

    config
      .expect(config.hre.ethers.utils.formatEther(amount) == 20)
      .to.equal(true, "001");
  });

  it("Can decrease token approval to another address", async function () {
    await config.accounts.owner.MyToken20.approve(
      config.accounts.alice.address,
      config.hre.ethers.utils.parseUnits("10", config.decimals)
    );
    await config.accounts.owner.MyToken20.decreaseAllowance(
      config.accounts.alice.address,
      config.hre.ethers.utils.parseUnits("10", config.decimals)
    );

    const amount = await config.accounts.owner.MyToken20.allowance(
      config.accounts.owner.address,
      config.accounts.alice.address
    );

    config
      .expect(config.hre.ethers.utils.formatEther(amount) == 0)
      .to.equal(true, "001");
  });

  it("Can transfer token of address that approval to another address", async function () {
    await config.accounts.owner.MyToken20.approve(
      config.accounts.alice.address,
      config.hre.ethers.utils.parseUnits("10", config.decimals)
    );
    await config.accounts.alice.MyToken20.transferFrom(
      config.accounts.owner.address,
      config.accounts.bob.address,
      config.hre.ethers.utils.parseUnits("10", config.decimals)
    );

    let balance = await config.accounts.owner.MyToken20.balanceOf(
      config.accounts.owner.address
    );

    config
      .expect(
        config.hre.ethers.utils.formatEther(balance) == config.totalSupply - 10
      )
      .to.equal(true, "001");

    balance = await config.accounts.owner.MyToken20.balanceOf(
      config.accounts.bob.address
    );

    config
      .expect(config.hre.ethers.utils.formatEther(balance) == 10)
      .to.equal(true, "002");
  });

  it("Can transfer token to another address", async function () {
    await config.accounts.owner.MyToken20.transfer(
      config.accounts.alice.address,
      config.hre.ethers.utils.parseUnits("10", config.decimals)
    );

    let balance = await config.accounts.owner.MyToken20.balanceOf(
      config.accounts.owner.address
    );

    config
      .expect(
        config.hre.ethers.utils.formatEther(balance) == config.totalSupply - 10
      )
      .to.equal(true, "001");

    balance = await config.accounts.alice.MyToken20.balanceOf(
      config.accounts.alice.address
    );

    config
      .expect(config.hre.ethers.utils.formatEther(balance) == 10)
      .to.equal(true, "002");
  });

  it("Should not allow transfer token when pause", async function () {
    await config.accounts.owner.MyToken20.pause();

    await config
      .expect(
        config.accounts.owner.MyToken20.transfer(
          config.accounts.alice.address,
          config.hre.ethers.utils.parseUnits("10", config.decimals)
        )
      )
      .revertedWith("Pausable: paused");
  });

  it("Can mint token to another address", async function () {
    await config.accounts.owner.MyToken20.mint(
      config.accounts.alice.address,
      config.hre.ethers.utils.parseUnits("10", config.decimals)
    );

    const balance = await config.accounts.alice.MyToken20.balanceOf(
      config.accounts.alice.address
    );

    config
      .expect(config.hre.ethers.utils.formatEther(balance) == 10)
      .to.equal(true, "001");

    const totalSupply = await config.accounts.owner.MyToken20.totalSupply();

    config
      .expect(
        config.hre.ethers.utils.formatEther(totalSupply) ==
          config.totalSupply + 10
      )
      .to.equal(true, "002");
  });

  it("Should allow only owner role to mint the token", async function () {
    await config
      .expect(
        config.accounts.alice.MyToken20.mint(
          config.accounts.alice.address,
          config.hre.ethers.utils.parseUnits("10", config.decimals)
        )
      )
      .revertedWith("Ownable: caller is not the owner");
  });

  it("Can burn token from another address", async function () {
    await config.accounts.owner.MyToken20.mint(
      config.accounts.alice.address,
      config.hre.ethers.utils.parseUnits("10", config.decimals)
    );
    await config.accounts.owner.MyToken20.burn(
      config.accounts.alice.address,
      config.hre.ethers.utils.parseUnits("10", config.decimals)
    );

    const balance = await config.accounts.alice.MyToken20.balanceOf(
      config.accounts.alice.address
    );

    config
      .expect(config.hre.ethers.utils.formatEther(balance) == 0)
      .to.equal(true, "001");

    const totalSupply = await config.accounts.owner.MyToken20.totalSupply();

    config
      .expect(
        config.hre.ethers.utils.formatEther(totalSupply) == config.totalSupply
      )
      .to.equal(true, "002");
  });

  it("Should allow only owner role to burn the token", async function () {
    await config
      .expect(
        config.accounts.alice.MyToken20.burn(
          config.accounts.alice.address,
          config.hre.ethers.utils.parseUnits("10", config.decimals)
        )
      )
      .revertedWith("Ownable: caller is not the owner");
  });

  it("Can transfer ownership", async function () {
    config.accounts.owner.MyToken20.transferOwnership(
      config.accounts.alice.address
    );
    const owner = await config.accounts.alice.MyToken20.owner();

    config.expect(owner == config.accounts.alice.address).to.equal(true, "001");
  });
});
