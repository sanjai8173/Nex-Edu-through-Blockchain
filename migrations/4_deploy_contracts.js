const BillStorage = artifacts.require("BillStorage");

module.exports = function(deployer) {
  deployer.deploy(BillStorage);
};
