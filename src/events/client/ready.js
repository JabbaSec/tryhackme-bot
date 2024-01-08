const Giveaway = require("../mongo/schema/GiveawaySchema");
const { giveawayEnd } = require("../../utils/giveawayUtils");

module.exports = {
  name: "ready",
  once: true,

  async execute(client) {
    console.log(`${client.user.username} is ready`);

    // Set bot's activity
    client.user.setActivity(`https://tryhackme.com/`);

    // Initial check for giveaways that might have ended while the bot was offline
    console.log("Checking for giveaways that might have ended...");

    const now = new Date();
    const endedGiveaways = await Giveaway.find({
      endDate: { $lt: now },
      concluded: { $ne: true },
    });

    endedGiveaways.forEach(async (giveaway) => {
      console.log(
        `Ending giveaway ID ${giveaway._id} which has passed its end date.`
      );
      await giveawayEnd(client, giveaway._id, true);
    });

    console.log("Finished checking for giveaways.");
  },
};
