const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,

  async execute(client) {
    console.log(`${client.user.username} is ready`);

    client.user.setActivity(`https://tryhackme.com/`);
  },
};
