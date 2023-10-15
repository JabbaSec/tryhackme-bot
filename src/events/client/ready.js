const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,

  async execute(client) {
    guild = client.guilds.cache.get("990680847713697873");

    console.log(`${client.user.username} is ready`);

    client.user.setActivity(`${guild.memberCount} users`, {
      type: ActivityType.Watching,
    });
  },
};
