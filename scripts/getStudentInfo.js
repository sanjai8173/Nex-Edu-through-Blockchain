const StudentContract = artifacts.require("StudentContract");

module.exports = async function(callback) {
  try {
    const studentContractInstance = await StudentContract.deployed();

    const registerNumber = process.argv[4];

    const studentInfo = await studentContractInstance.getStudentInfoByRegistrationNumber(registerNumber);
    
    const paidFeeIds = studentInfo.paidFees.map(feeId => feeId.toString()); // Convert BigNumber to string

    const response = {
      registerNumber: studentInfo.registerNumber,
      name: studentInfo.name,
      department: studentInfo.department,
      studentType: studentInfo.studentType,
      paidFees: paidFeeIds
    };

    console.log(JSON.stringify(response, null, 2));

    callback();
  } catch (error) {
    console.error(error);
    callback();
  }
};
