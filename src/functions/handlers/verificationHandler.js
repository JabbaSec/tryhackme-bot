const UserProfile = require("../../events/mongo/schema/ProfileSchema");

// Map roles to their IDs
const levelToRoleMap = {
  1337: process.env.LEVEL_EVENT,
  999: process.env.LEVEL_BUG_HUNTER,
  998: process.env.LEVEL_13,
  997: process.env.LEVEL_13,
  13: process.env.LEVEL_13,
  12: process.env.LEVEL_12,
  11: process.env.LEVEL_11,
  10: process.env.LEVEL_10,
  9: process.env.LEVEL_9,
  8: process.env.LEVEL_8,
  7: process.env.LEVEL_7,
  6: process.env.LEVEL_6,
  5: process.env.LEVEL_5,
  4: process.env.LEVEL_4,
  3: process.env.LEVEL_3,
  2: process.env.LEVEL_2,
  1: process.env.LEVEL_1,
};

module.exports = (client) => {
  client.roleSync = async (client) => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const userProfile = await UserProfile.find();

    for (const userData of userProfile) {
      try {
        const isMember = await guild.members
          .fetch(userData.discordId)
          .then(() => true)
          .catch(() => false);

        // Check if they are NOT a member of the Discord server
        if (!isMember) {
          await UserProfile.findOneAndDelete({ discordId: userData.discordId });

          console.log(`Removed ${userData.discordId} from the database.`);
          continue;
        }

        // Retrieve the user's data from the API
        const apiData = await client.handleAPI.get_user_by_token(
          userData.token
        );

        if (userData.level !== apiData.level) {
          guild.members.fetch(userData.discordId).then((member) => {
            member.roles.add(getRolesForLevel(apiData.level));
            member.roles.remove(getRolesForLevel(parseInt(userData.level)));
          });
        }

        if (apiData.subscriptionStatus) {
          guild.members.fetch(userData.discordId).then((member) => {
            member.roles.add(process.env.SUBSCRIBER_ROLE_ID);
          });
        } else {
          guild.members.fetch(userData.discordId).then((member) => {
            member.roles.remove(process.env.SUBSCRIBER_ROLE_ID);
          });
        }

        const updatedData = {
          $set: {
            thmUsername: apiData.thmUsername,
            token: apiData.token,
            subscriptionStatus: apiData.subscriptionStatus,
            rank: apiData.rank,
            points: apiData.points,
            level: apiData.level,
          },
        };

        const updateProfile = await UserProfile.updateMany(
          { discordId: userData.discordId },
          updatedData
        );

        console.log(`${userData.discordId} has been verified!`);
      } catch (error) {
        console.error(
          `Error processing user ${userData.discordId}: ${error.message}`
        );
      }
    }
  };
};

function getRolesForLevel(level) {
  console.log(levelToRoleMap[level]);
  return levelToRoleMap[level] || [];
}
