const FeeContract = artifacts.require("FeeContract");

module.exports = async function(callback) {
  try {
    const feeContractInstance = await FeeContract.deployed();

    const feeType = process.argv[4];

    const retrievedFees = [];

    for (let i = 0; i < await feeContractInstance.getFeeCount(); i++) {
      const fee = await feeContractInstance.getFee(i);
      if (fee.feeType === feeType) {
        retrievedFees.push({
          feeId: fee.feeId,
          title: fee.title,
          description: fee.description,
          amount: fee.amount,
          deadline: formatDate(new Date(fee.deadline * 1000)),
          studentType: fee.studentType,
          feeType: fee.feeType,
        });
      }
    }

    const output = {
      feeType: feeType,
      fees: retrievedFees,
    };

    console.log(JSON.stringify(output, null, 2)); // Pretty print JSON

    callback();
  } catch (error) {
    console.error(error);
    callback();
  }
};

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
