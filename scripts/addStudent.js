const StudentContract = artifacts.require("StudentContract");

module.exports = async function(callback) {
  try {
    const studentContractInstance = await StudentContract.deployed();

    const registerNumber = process.argv[4];
    const name = process.argv[5];
    const department = process.argv[6];
    const studentType = process.argv[7];

    await studentContractInstance.registerStudent(registerNumber, name, department, studentType);
    const response = {
      message: "Student added successfully",
    };
    console.log(JSON.stringify(response, null, 2));

    callback();
  } catch (error) {
    const response = {
      message: "Student already exists",
    };
    console.log(JSON.stringify(response, null, 2));
    callback();
  }
};
