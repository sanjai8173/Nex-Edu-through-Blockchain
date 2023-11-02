const FeeContract = artifacts.require("FeeContract");

module.exports = function(deployer) {
  deployer.deploy(FeeContract);
};
