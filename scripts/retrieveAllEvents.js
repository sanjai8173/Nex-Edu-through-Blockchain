const EventStorage = artifacts.require("EventStorage");

module.exports = async function (callback) {
  try {
    const eventStorageInstance = await EventStorage.deployed();

    const eventCount = await eventStorageInstance.getEventCount();

    const events = [];

    for (let i = 1; i <= eventCount; i++) {
      const event = await eventStorageInstance.getEvent(i);
      events.push(event);
    }

    console.log("All Events:");
    console.log(JSON.stringify(events, null, 2));

    callback();
  } catch (error) {
    console.error("Error retrieving events:", error);
    callback(error);
  }
};
