// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract EventStorage {
    struct Event {
        string eventName;
        uint256 totalStudents;
        string description;
        string eventType;
        string department;
        uint256 timestamp;
    }

    mapping(uint256 => Event) public events;
    uint256 public eventCount;

    function addEvent(
        string memory _eventName,
        uint256 _totalStudents,
        string memory _description,
        string memory _eventType,
        string memory _department
    ) public {
        eventCount++;
        events[eventCount] = Event(
            _eventName,
            _totalStudents,
            _description,
            _eventType,
            _department,
            block.timestamp
        );
    }

    function getEvent(uint256 _eventId)
        public
        view
        returns (
            string memory,
            uint256,
            string memory,
            string memory,
            string memory,
            uint256
        )
    {
        require(_eventId > 0 && _eventId <= eventCount, "Invalid event ID");
        Event memory eventData = events[_eventId];
        return (
            eventData.eventName,
            eventData.totalStudents,
            eventData.description,
            eventData.eventType,
            eventData.department,
            eventData.timestamp
        );
    }

    function getEventCount() public view returns (uint256) {
        return eventCount;
    }
}
