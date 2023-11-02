const StudentContract = artifacts.require("StudentContract");

module.exports = async function(callback) {
  try {
    const studentContractInstance = await StudentContract.deployed();

    const registerNumber = process.argv[4];

    const paidFees = await studentContractInstance.getPaidFees(registerNumber);
    const paidFeeIds = paidFees.map(feeId => feeId.toNumber());

    const response = {
      registerNumber: registerNumber,
      paidFees: paidFeeIds,
    };
    console.log(JSON.stringify(response, null, 2));

    callback();
  } catch (error) {
    console.error(error);
    callback();
  }
};
