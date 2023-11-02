const EventStorage = artifacts.require("EventStorage");

module.exports = async function(callback) {
  try {
    const eventStorageInstance = await EventStorage.deployed();

    const eventName = process.argv[4];
    const totalStudents = parseInt(process.argv[5]);
    const description = process.argv[6];
    const eventType = process.argv[7];
    const department = process.argv[8]; // New parameter for department

    await eventStorageInstance.addEvent(
      eventName,
      totalStudents,
      description,
      eventType,
      department // Pass department
    );

    const eventCount = await eventStorageInstance.eventCount();
    const response = {
      message: "Event added successfully",
      eventId: eventCount,
    };
    console.log(JSON.stringify(response, null, 2));

    callback();
  } catch (error) {
    const response = {
      message: "Error adding event",
      error: error.message,
    };
    console.log(JSON.stringify(response, null, 2));
    callback();
  }
};
