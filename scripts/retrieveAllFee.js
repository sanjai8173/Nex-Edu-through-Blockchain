const FeeContract = artifacts.require("FeeContract");

module.exports = async function(callback) {
  try {
    const feeContract = await FeeContract.deployed();
    const feeCount = await feeContract.getFeeCount();

    const fees = [];

    for (let i = 0; i < feeCount; i++) {
      const fee = await feeContract.getFee(i);
      const formattedDeadline = formatDate(new Date(fee.deadline * 1000));

      fees.push({
        feeId: fee.feeId,
        title: fee.title,
        description: fee.description,
        amount: fee.amount,
        deadline: formattedDeadline,
        studentType: fee.studentType,
        feeType: fee.feeType,
      });
    }

    console.log(JSON.stringify(fees, null, 2)); // Pretty print JSON

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
