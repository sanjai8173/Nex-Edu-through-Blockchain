const FeeContract = artifacts.require("FeeContract");

module.exports = async function(callback) {
  try {
    const feeContractInstance = await FeeContract.deployed();

    const feeId = parseInt(process.argv[4]);
    const title = process.argv[5];
    const description = process.argv[6];
    const amount = parseInt(process.argv[7]);
    const deadline = parseInt(process.argv[8]);
    const studentType = process.argv[9];
    const feeType = process.argv[10]; // New field for fee type

    await feeContractInstance.addFee(feeId, title, description, amount, deadline, studentType, feeType);

    const newFee = await feeContractInstance.getFeeById(feeId);

    const response = {
      success: true,
      message: `Fee with ID ${feeId} added to the contract.`
    };

    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    const response = {
      success: false,
      message: "An error occurred while adding the fee.",
      error: error.toString()
    };

    console.error(JSON.stringify(response, null, 2));
  }
  callback();
};
