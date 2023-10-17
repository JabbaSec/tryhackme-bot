const UserProfile = require("../../events/mongo/schema/ProfileSchema");
const { fetchMember } = require("../../utils/memberUtils");
const { assignRoles } = require("../../utils/roleUtils");

module.exports = (client) => {
  client.roleSync = async () => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const userProfiles = await UserProfile.find();

    for (const profile of userProfiles) {
      const member = await fetchMember(guild, profile.discordId);

      if (!member) {
        await UserProfile.findOneAndDelete({ discordId: profile.discordId });
        continue;
      }

      const userApiData = await client.handleAPI.get_user_data(
        profile.username
      );

      if (!userApiData || !userApiData.userRank) {
        console.error(
          "Received invalid data from the API for user:",
          profile.username
        );
        continue;
      }

      // Update roles based on API data
      assignRoles(member, userApiData);

      // Update user's data in database
      profile.subscribed = userApiData.subscribed == "1" ? true : false;
      profile.rank = userApiData.userRank;
      profile.points = userApiData.points;
      profile.level = userApiData.level;
      profile.avatar = userApiData.avatar;
      await profile.save().catch(console.error);
    }
  };
};
