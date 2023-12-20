const Profile = require("../mongo/schema/ProfileSchema");
const Ban = require("../mongo/schema/BanSchema");

module.exports = {
  name: "guildBanAdd",
  once: false,

  async execute(ban) {
    console.log(`${ban.user.tag} was banned from ${ban.guild.name}`);

    try {
      const profile = await Profile.findOne({ discordId: ban.user.id });

      if (profile) {
        const banData = new Ban({
          discordId: profile.discordId,
          username: profile.username,
          token: profile.token,
          subscribed: profile.subscribed,
          level: profile.level,
          avatar: profile.avatar,
        });

        await banData.save();

        console.log(
          `User data transferred to Ban collection for ${ban.user.tag}`
        );
      } else {
        console.log(`User not found in Profile collection for ${ban.user.tag}`);
      }
    } catch (error) {
      console.error(`Error transferring user data for ${ban.user.tag}:`, error);
    }
  },
};
