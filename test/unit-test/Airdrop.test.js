/* eslint-disable eqeqeq */
let config = require("../config/IConfig.test");

describe("Airdrop", async function () {
  beforeEach(async () => {
    const _config = require("../config/Config.test.js");
    config = await _config.setting();
  });

  it("Can check airdrop address", async function () {
    const airdropAddress = await config.accounts.owner.Airdrop.airdrop();

    config
      .expect(airdropAddress == config.accounts.owner.MyToken20.address)
      .to.equal(true, "001");
  });

  it("Can check verifier address", async function () {
    const verifierAddress = await config.accounts.owner.Airdrop.verifier();

    config
      .expect(verifierAddress == config.accounts.owner.address)
      .to.equal(true, "001");
  });

  it("Can check claim status", async function () {
    const claimStatus = await config.accounts.owner.Airdrop.claimStatus(
      config.accounts.owner.address
    );

    config.expect(claimStatus == false).to.equal(true, "001");
  });

  it("Can set verifier", async function () {
    await config.accounts.owner.Airdrop.setVerifier(
      config.accounts.alice.address
    );

    const verifierAddress = await config.accounts.owner.Airdrop.verifier();

    config
      .expect(verifierAddress == config.accounts.alice.address)
      .to.equal(true, "001");
  });

  it("Should not allow set verifier when already set", async function () {
    await config.accounts.owner.Airdrop.setVerifier(
      config.accounts.alice.address
    );

    await config
      .expect(
        config.accounts.owner.Airdrop.setVerifier(config.accounts.alice.address)
      )
      .revertedWith("MyAirdrop: Verifier already set");
  });

  it("Should allow only owner role to set verifier", async function () {
    await config
      .expect(
        config.accounts.alice.Airdrop.setVerifier(config.accounts.alice.address)
      )
      .revertedWith("Ownable: caller is not the owner");
  });

  it("Can set airdrop", async function () {
    await config.accounts.owner.Airdrop.setAirdrop(
      "0x0000000000000000000000000000000000000000"
    );

    const airdropAddress = await config.accounts.owner.Airdrop.airdrop();

    config
      .expect(airdropAddress == "0x0000000000000000000000000000000000000000")
      .to.equal(true, "001");
  });

  it("Should not allow set airdrop when already set", async function () {
    await config.accounts.owner.Airdrop.setAirdrop(
      "0x0000000000000000000000000000000000000000"
    );

    await config
      .expect(
        config.accounts.owner.Airdrop.setAirdrop(
          "0x0000000000000000000000000000000000000000"
        )
      )
      .revertedWith("MyAirdrop: Airdrop already set");
  });

  it("Should allow only owner role to set airdrop", async function () {
    await config
      .expect(
        config.accounts.alice.Airdrop.setAirdrop(
          "0x0000000000000000000000000000000000000000"
        )
      )
      .revertedWith("Ownable: caller is not the owner");
  });

  it("Can check owner", async function () {
    const owner = await config.accounts.owner.Airdrop.owner();

    config.expect(owner == config.accounts.owner.address).to.equal(true, "001");
  });

  it("Can check pause", async function () {
    const pause = await config.accounts.owner.Airdrop.paused();

    config.expect(pause == false).to.equal(true, "001");
  });

  it("Can pause", async function () {
    await config.accounts.owner.Airdrop.pause();
    const pause = await config.accounts.owner.Airdrop.paused();

    config.expect(pause == true).to.equal(true, "001");
  });

  it("Can unpause", async function () {
    await config.accounts.owner.Airdrop.pause();
    await config.accounts.owner.Airdrop.unpause();
    const pause = await config.accounts.owner.Airdrop.paused();

    config.expect(pause == false).to.equal(true, "001");
  });

  it("Should allow only owner role to pause", async function () {
    await config
      .expect(config.accounts.alice.Airdrop.pause())
      .revertedWith("Ownable: caller is not the owner");
  });

  it("Should allow only owner role to unpause", async function () {
    await config.accounts.owner.Airdrop.pause();
    await config
      .expect(config.accounts.alice.Airdrop.unpause())
      .revertedWith("Ownable: caller is not the owner");
  });

  it("Can verify claimer", async function () {
    const signMsg = await config.accounts.owner.signMessage(
      config.accounts.alice.address
    );

    const verifyResult = await config.accounts.alice.Airdrop.verify(
      signMsg.sig.v,
      signMsg.sig.r,
      signMsg.sig.s,
      config.accounts.alice.address
    );

    config.expect(verifyResult == true).to.equal(true, "001");
  });

  it("Should invalid verify when the verifier is not matching with already set", async function () {
    const signMsg = await config.accounts.alice.signMessage(
      config.accounts.alice.address
    );

    const verifyResult = await config.accounts.alice.Airdrop.verify(
      signMsg.sig.v,
      signMsg.sig.r,
      signMsg.sig.s,
      config.accounts.alice.address
    );

    config.expect(verifyResult == false).to.equal(true, "001");
  });

  it("Can claim", async function () {
    const signMsg = await config.accounts.owner.signMessage(
      config.accounts.alice.address
    );

    await config.accounts.alice.Airdrop.claim(
      signMsg.sig.v,
      signMsg.sig.r,
      signMsg.sig.s,
      config.accounts.alice.address,
      "0"
    );

    const claimStatus = await config.accounts.alice.Airdrop.claimStatus(
      config.accounts.alice.address
    );

    config.expect(claimStatus == true).to.equal(true, "001");
  });

  it("Should invalid claim when the verifier is not matching with already set", async function () {
    const signMsg = await config.accounts.alice.signMessage(
      config.accounts.alice.address
    );

    await config
      .expect(
        config.accounts.alice.Airdrop.claim(
          signMsg.sig.v,
          signMsg.sig.r,
          signMsg.sig.s,
          config.accounts.alice.address,
          "0"
        )
      )
      .revertedWith("MyAirdrop: Invalid verifier");
  });

  it("Should not be allowed to duplicate claim", async function () {
    const signMsg = await config.accounts.owner.signMessage(
      config.accounts.alice.address
    );

    await config.accounts.alice.Airdrop.claim(
      signMsg.sig.v,
      signMsg.sig.r,
      signMsg.sig.s,
      config.accounts.alice.address,
      "0"
    );

    await config
      .expect(
        config.accounts.alice.Airdrop.claim(
          signMsg.sig.v,
          signMsg.sig.r,
          signMsg.sig.s,
          config.accounts.alice.address,
          "0"
        )
      )
      .revertedWith("MyAirdrop: Already claimed");
  });

  it("Should not allow claiming if not own address", async function () {
    const signMsg = await config.accounts.owner.signMessage(
      config.accounts.alice.address
    );

    await config
      .expect(
        config.accounts.bob.Airdrop.claim(
          signMsg.sig.v,
          signMsg.sig.r,
          signMsg.sig.s,
          config.accounts.alice.address,
          "0"
        )
      )
      .revertedWith("MyAirdrop: Is not own address");
  });
});
