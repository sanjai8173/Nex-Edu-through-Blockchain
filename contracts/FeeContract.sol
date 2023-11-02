// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract FeeContract {
    struct Fee {
        uint256 feeId;
        string title;
        string description;
        uint256 amount;
        uint256 deadline;
        string studentType;
        string feeType; // New field for fee type
    }

    Fee[] public fees;

    event FeeAdded(uint256 indexed feeId, string title, string message);

    function addFee(uint256 _feeId, string memory _title, string memory _description, uint256 _amount, uint256 _deadline, string memory _studentType, string memory _feeType) public {
        for (uint256 i = 0; i < fees.length; i++) {
            if (fees[i].feeId == _feeId) {
                emit FeeAdded(_feeId, _title, "Fee ID already exists");
                return;
            }
        }

        fees.push(Fee(_feeId, _title, _description, _amount, _deadline, _studentType, _feeType));
        emit FeeAdded(_feeId, _title, "Fee added successfully");
    }

    function getFeeCount() public view returns (uint256) {
        return fees.length;
    }

    function getFee(uint256 _index) public view returns (Fee memory) {
        require(_index < fees.length, "Invalid index");
        return fees[_index];
    }

    function getFeeById(uint256 _feeId) public view returns (Fee memory) {
        for (uint256 i = 0; i < fees.length; i++) {
            if (fees[i].feeId == _feeId) {
                return fees[i];
            }
        }
        revert("Fee not found");
    }
}
