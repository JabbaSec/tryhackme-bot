const UserProfile = require("../../events/mongo/schema/ProfileSchema");

// Map roles to their IDs
const levelToRoleMap = {
  1: "1163058274296410153",
  2: "1159486602242969662",
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
        const exampleData = {
          discordId: "exampleDiscordId",
          thmUsername: "exampleThmUsername",
          token: "exampleToken",
          subscriptionStatus: true,
          rank: "exampleRank",
          points: "examplePoints",
          level: 1,
        };

        if (userData.level !== exampleData.level) {
          guild.members.fetch(userData.discordId).then((member) => {
            member.roles.add(getRolesForLevel(exampleData.level));
            member.roles.remove(getRolesForLevel(parseInt(userData.level)));
          });
        }

        if (exampleData.subscriptionStatus) {
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
            thmUsername: exampleData.thmUsername,
            token: exampleData.token,
            subscriptionStatus: exampleData.subscriptionStatus,
            rank: exampleData.rank,
            points: exampleData.points,
            level: exampleData.level,
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
  return levelToRoleMap[level] || [];
}
