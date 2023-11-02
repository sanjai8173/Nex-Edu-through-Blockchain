const StudentContract = artifacts.require("StudentContract");

module.exports = async function(callback) {
  try {
    const studentContractInstance = await StudentContract.deployed();

    const registerNumber = process.argv[4];
    const feeId = parseInt(process.argv[5]);

    await studentContractInstance.payFee(registerNumber, feeId);

    const response = {
      message: `Fee paid for Student ${registerNumber}, Fee ID: ${feeId}`
    };

    console.log(JSON.stringify(response, null, 2));

    callback();
  } catch (error) {
    console.error(error);
    callback();
  }
};
