const EventStorage = artifacts.require("EventStorage");

module.exports = async function (callback) {
  try {
    const eventStorageInstance = await EventStorage.deployed();

    const department = process.argv[4]; // Department name you want to filter by

    const eventCount = await eventStorageInstance.getEventCount();

    const events = [];

    for (let i = 1; i <= eventCount.toNumber(); i++) {
      const event = await eventStorageInstance.getEvent(i);
      if (event.department === department) {
        events.push(event);
      }
    }

    if (events.length === 0) {
      console.log(`No events found for department: ${department}`);
    } else {
      console.log(`Events for department: ${department}`);
      console.log(events);
    }

    callback();
  } catch (error) {
    console.error(error);
    callback(error);
  }
};
