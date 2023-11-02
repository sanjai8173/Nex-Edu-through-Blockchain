const FeeContract = artifacts.require("FeeContract");

module.exports = async function(callback) {
  try {
    const feeContractInstance = await FeeContract.deployed();

    const feeIds = process.argv.slice(4).map(id => parseInt(id));

    const feeInfos = [];

    for (const feeId of feeIds) {
      const retrievedFee = await feeContractInstance.getFeeById(feeId);

      const deadlineTimestamp = parseInt(retrievedFee.deadline);
      const deadlineDate = new Date(deadlineTimestamp * 1000);

      const formattedDeadline = formatDate(deadlineDate);

      const feeInfo = {
        feeId: retrievedFee.feeId,
        title: retrievedFee.title,
        description: retrievedFee.description,
        amount: retrievedFee.amount,
        deadline: formattedDeadline,
        studentType: retrievedFee.studentType,
        feeType: retrievedFee.feeType,
      };

      feeInfos.push(feeInfo);
    }

    console.log(JSON.stringify(feeInfos, null, 2)); // Pretty print JSON

    callback();
  } catch (error) {
    console.error(error);
    callback();
  }
};

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1; // January is 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
