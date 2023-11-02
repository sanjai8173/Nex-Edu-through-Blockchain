// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract BillStorage {
    struct Bill {
        string senderRegNo;
        string senderName;
        string senderAccountNo;
        string receiverRegNo;
        string receiverName;
        string receiverAccountNo;
        uint256 amount;
        uint256 dateTime;
        string description;
        uint256 feeId; // New field for fee ID
    }

    mapping(uint256 => Bill) public bills;
    mapping(bytes32 => uint256) public billIndices; // New mapping for quick lookup
    uint256 public billCount;

    function addBill(
        string memory _senderRegNo,
        string memory _senderName,
        string memory _senderAccountNo,
        string memory _receiverRegNo,
        string memory _receiverName,
        string memory _receiverAccountNo,
        uint256 _amount,
        uint256 _dateTime,
        string memory _description,
        uint256 _feeId
    ) public {
        billCount++;
        bills[billCount] = Bill(
            _senderRegNo,
            _senderName,
            _senderAccountNo,
            _receiverRegNo,
            _receiverName,
            _receiverAccountNo,
            _amount,
            _dateTime,
            _description,
            _feeId
        );

        bytes32 key = keccak256(abi.encodePacked(_senderRegNo, _feeId));
        billIndices[key] = billCount; // Store the bill index for quick lookup
    }

    function getBillByBillNo(uint256 _billNo)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            uint256,
            uint256,
            string memory,
            uint256
        )
    {
        require(_billNo > 0 && _billNo <= billCount, "Invalid bill number");
        Bill memory bill = bills[_billNo];
        return (
            bill.senderRegNo,
            bill.senderName,
            bill.senderAccountNo,
            bill.receiverRegNo,
            bill.receiverName,
            bill.receiverAccountNo,
            bill.amount,
            bill.dateTime,
            bill.description,
            bill.feeId
        );
    }

    function getBillCount() public view returns (uint256) {
        return billCount;
    }

    function getBillBySenderAndFeeId(
        string memory _senderRegNo,
        uint256 _feeId
    )
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            uint256,
            uint256,
            string memory
        )
    {
        bytes32 key = keccak256(abi.encodePacked(_senderRegNo, _feeId));
        uint256 billIndex = billIndices[key];
        require(billIndex > 0, "Bill not found");
        Bill memory bill = bills[billIndex];
        return (
            bill.senderRegNo,
            bill.senderName,
            bill.senderAccountNo,
            bill.receiverRegNo,
            bill.receiverName,
            bill.receiverAccountNo,
            bill.amount,
            bill.dateTime,
            bill.description
        );
    }
}
