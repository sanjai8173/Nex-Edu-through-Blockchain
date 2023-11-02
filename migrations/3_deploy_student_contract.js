const StudentContract = artifacts.require("StudentContract");

module.exports = function(deployer) {
  deployer.deploy(StudentContract);
};
