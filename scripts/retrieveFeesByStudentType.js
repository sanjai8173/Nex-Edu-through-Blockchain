const FeeContract = artifacts.require("FeeContract");

module.exports = async function(callback) {
  try {
    const feeContractInstance = await FeeContract.deployed();

    const studentType = process.argv[4];

    const retrievedFees = [];

    const feeCount = await feeContractInstance.getFeeCount();

    for (let i = 0; i < feeCount; i++) {
      const fee = await feeContractInstance.getFee(i);
      if (fee.studentType === studentType) {
        retrievedFees.push({
          feeId: fee.feeId,
          title: fee.title,
          description: fee.description,
          amount: fee.amount,
          deadline: formatDate(fee.deadline),
          studentType: fee.studentType,
          feeType: fee.feeType,
        });
      }
    }

    const output = {
      studentType: studentType,
      fees: retrievedFees,
    };

    console.log(JSON.stringify(output, null, 2)); // Pretty print JSON

    callback();
  } catch (error) {
    console.error(error);
    callback();
  }
};

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, ${date.toLocaleTimeString()}`;
  return formattedDate;
}
