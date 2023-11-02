const BillStorage = artifacts.require("BillStorage");

module.exports = async function(callback) {
  try {
    const billStorageInstance = await BillStorage.deployed();

    const senderRegNo = process.argv[4];
    const senderName = process.argv[5];
    const senderAccountNo = process.argv[6];
    const receiverRegNo = process.argv[7];
    const receiverName = process.argv[8];
    const receiverAccountNo = process.argv[9];
    const amount = parseInt(process.argv[10]);
    const dateTime = Math.floor(Date.now() / 1000);
    const description = process.argv[11];
    const feeId = parseInt(process.argv[12]); // Fee ID

    await billStorageInstance.addBill(
      senderRegNo,
      senderName,
      senderAccountNo,
      receiverRegNo,
      receiverName,
      receiverAccountNo,
      amount,
      dateTime,
      description,
      feeId // Pass fee ID
    );

    const billCount = await billStorageInstance.billCount();
    const response = {
      message: "Bill added successfully",
      billNumber: billCount,
    };
    console.log(JSON.stringify(response, null, 2));

    callback();
  } catch (error) {
    const response = {
      message: "Error adding bill",
      error: error.message,
    };
    console.log(JSON.stringify(response, null, 2));
    callback();
  }
};
