const EventStorage = artifacts.require("EventStorage");

module.exports = function (deployer) {
  deployer.deploy(EventStorage);
};
