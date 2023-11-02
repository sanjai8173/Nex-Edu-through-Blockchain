// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract StudentContract {
    struct Student {
        string registerNumber;
        string name;
        string department;
        string studentType;
        uint256[] paidFees;
    }

    mapping(string => bool) private registeredStudents;
    mapping(string => Student) private students;

    event StudentAdded(string registerNumber, string name, string department, string studentType);
    event FeePaid(string registerNumber, uint256 feeId);

    modifier onlyRegisteredStudent(string memory registerNumber) {
        require(registeredStudents[registerNumber], "Student not registered");
        _;
    }

    function registerStudent(string memory registerNumber, string memory name, string memory department, string memory studentType) external {
        require(!registeredStudents[registerNumber], "Student already registered");
        students[registerNumber] = Student(registerNumber, name, department, studentType, new uint256[](0));
        registeredStudents[registerNumber] = true;
        emit StudentAdded(registerNumber, name, department, studentType);
    }

    function checkStudentExists(string memory registerNumber) external view returns (bool) {
        return registeredStudents[registerNumber];
    }

    function getStudentInfoByRegistrationNumber(string memory registerNumber) external view returns (Student memory) {
        require(registeredStudents[registerNumber], "Student not registered");
        return students[registerNumber];
    }

    function payFee(string memory registerNumber, uint256 feeId) external onlyRegisteredStudent(registerNumber) {
        students[registerNumber].paidFees.push(feeId);
        emit FeePaid(registerNumber, feeId);
    }

    function getPaidFees(string memory registerNumber) external view returns (uint256[] memory) {
        require(registeredStudents[registerNumber], "Student not registered");
        return students[registerNumber].paidFees;
    }
}
