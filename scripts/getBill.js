const BillStorage = artifacts.require("BillStorage");

module.exports = async function(callback) {
  try {
    const billStorageInstance = await BillStorage.deployed();

    // Get the sender registration number and fee ID from command-line arguments
    const senderRegNo = process.argv[4]; // Argument at index 4
    const feeId = parseInt(process.argv[5]); // Argument at index 5

    const bill = await billStorageInstance.getBillBySenderAndFeeId(senderRegNo, feeId);

    const response = {
      message: "Bill retrieved successfully",
      bill: {
        senderRegNo: bill[0],
        senderName: bill[1],
        senderAccountNo: bill[2],
        receiverRegNo: bill[3],
        receiverName: bill[4],
        receiverAccountNo: bill[5],
        amount: bill[6].toString(),
        dateTime: bill[7].toString(),
        description: bill[8]
      }
    };

    // Log the response as JSON string
    console.log(JSON.stringify(response, null, 2));

    callback();
  } catch (error) {
    console.error("Error getting bill:", error);
    callback(error);
  }
};
