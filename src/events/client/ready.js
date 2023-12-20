const { ActivityType } = require("discord.js");

const {
  checkDate,
  createTimer,
  getTimeoutDuration,
} = require("../../utils/timerUtils.js");

const Giveaway = require("../mongo/schema/GiveawaySchema");

module.exports = {
  name: "ready",
  once: true,

  async execute(client) {
    console.log(`${client.user.username} is ready`);

    client.user.setActivity(`https://tryhackme.com/`);

    console.log("Checking for giveaways...");

    // Fetch active giveaways
    const now = new Date();
    const activeGiveaways = await Giveaway.find({ endDate: { $gt: now } });

    // Recreate timers for each active giveaway
    activeGiveaways.forEach(async (giveaway) => {
      const duration = await getTimeoutDuration(giveaway.endDate);

      if (duration > 0) {
        const timerCallback = () => {
          console.log(`Giveaway ended for giveaway ID ${giveaway._id}`);
        };

        if (await createTimer(client, duration, timerCallback, giveaway._id)) {
          console.log(`Timer recreated for giveaway ID ${giveaway._id}.`);
        } else {
          console.log(
            `Failed to recreate timer for giveaway ID ${giveaway._id}.`
          );
        }
      }
    });

    console.log("Finished checking for active giveaways.");
  },
};
