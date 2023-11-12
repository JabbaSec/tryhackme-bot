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

      const userApiData = await client.handleAPI.get_token_data(profile.token);

      if (isValidApiData(userApiData)) {
        const hasUpdated = updateProfileFromApiData(profile, userApiData);
        if (hasUpdated) {
          assignRoles(member, userApiData);
          await profile.save().catch(console.error);
          console.log(`${profile.discordId} has been updated!`);
        } else {
          console.log(`${profile.discordId} is up-to-date!`);
        }
      } else {
        console.error(
          "Received invalid data from the API for user:",
          profile.discordId
        );
      }
    }
  };
};

function isValidApiData(data) {
  return data && data.success;
}

function updateProfileFromApiData(profile, apiData) {
  const { subscribed, usersRank, points, level, avatar } = apiData;
  profile.subscribed = subscribed === 1;
  profile.rank = usersRank;
  profile.points = points;
  profile.level = level;
  profile.avatar = avatar;

  return profile.isModified();
}
