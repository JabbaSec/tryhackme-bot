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
        console.log(`${profile.discordId} has been removed from the Database.`);
        continue;
      }

      const userApiData = await client.handleAPI.get_token_data(profile.token);

      if (userApiData.response == 429) {
        console.log("Too many requests, skipping verification...");
        break;
      }

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
    console.log("Role sync finished!");
  };
};

function isValidApiData(data) {
  return data && data.success;
}

function updateProfileFromApiData(profile, apiData) {
  const { username, subscribed, usersRank, points, level, avatar } = apiData;
  profile.username = username;
  profile.subscribed = subscribed === 1;
  profile.level = level;
  profile.avatar = avatar;

  return profile.isModified();
}
