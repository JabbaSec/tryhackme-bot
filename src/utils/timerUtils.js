const Giveaway = require("../events/mongo/schema/GiveawaySchema");

const { giveawayEnd } = require("../utils/giveawayUtils");

async function checkDate(day, month, year, time) {
  try {
    const adjustedMonth = month - 1;

    return new Date(year, adjustedMonth, day, time, 0);
  } catch (error) {
    console.log("There was an error checking the date:", error);
    return false;
  }
}

async function getTimeoutDuration(futureDate) {
  try {
    const now = new Date();

    const duration = futureDate.getTime() - now.getTime();

    return duration > 0 ? duration : 0;
  } catch (err) {
    console.log("There was an error getting the timeout duration:", error);
    return false;
  }
}

async function checkGiveaways(client) {
  try {
    const now = new Date();
    const giveaways = await Giveaway.find({
      endDate: { $lte: now },
      concluded: { $ne: true },
    });

    giveaways.forEach(async (giveaway) => {
      await giveawayEnd(client, giveaway._id, true);
      console.log(`Giveaway ended for giveaway ID: ${giveaway._id}`);
      // Update the giveaway as concluded
      giveaway.concluded = true;
      await giveaway.save();
    });
  } catch (err) {
    console.error("Error checking giveaways:", err);
  }
}

module.exports = {
  checkDate,
  getTimeoutDuration,
  checkGiveaways,
};
