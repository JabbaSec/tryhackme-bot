const Ban = require("../mongo/schema/BanSchema");

module.exports = {
  name: "guildBanRemove",
  once: false,

  async execute(ban) {
    console.log(`${ban.user.tag} was unbanned from ${ban.guild.name}`);

    try {
      const bannedUser = await Ban.findOne({ discordId: ban.user.id });

      if (bannedUser) {
        await Ban.deleteOne({ discordId: ban.user.id });

        console.log(`User removed from Ban collection: ${ban.user.tag}`);
      } else {
        console.log(`User not found in Ban collection: ${ban.user.tag}`);
      }
    } catch (error) {
      console.error(
        `Error removing user from Ban collection: ${ban.user.tag}`,
        error
      );
    }
  },
};
