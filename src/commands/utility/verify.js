const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Syncs your TryHackMe site account to Discord")
    .addStringOption((option) =>
      option
        .setName("token")
        .setDescription("Your Discord token from https://tryhackme.com/profile")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const token = interaction.options.getString("token");
    const guild = client.guilds.cache.get(process.env.GUILD_ID);

    let userProfile = await UserProfile.findOne({ token });

    if (userProfile)
      return interaction.reply({
        content: "You are already verified!",
        ephemeral: true,
      });

    const tokenApiData = await client.handleAPI.get_user_by_token(token);

    const userApiData = await client.handleAPI.get_user_data(
      tokenApiData.username
    );

    const verify = new UserProfile({
      discordId: interaction.user.id,
      username: tokenApiData.username,
      token: token,
      subscribed: tokenApiData.subscribed == "1" ? true : false,
      rank: userApiData.userRank,
      points: userApiData.points,
      level: tokenApiData.level,
      avatar: tokenApiData.avatar,
    });

    await verify.save().catch(console.error);

    guild.members.fetch(interaction.user.id).then((member) => {
      member.roles.add(getRolesForLevel(tokenApiData.level));
    });

    if (tokenApiData.subscriptionStatus == "1") {
      guild.members.fetch(interaction.user.id).then((member) => {
        member.roles.add(process.env.SUBSCRIBER_ROLE_ID);
      });
    } else {
      guild.members.fetch(interaction.user.id).then((member) => {
        member.roles.remove(process.env.SUBSCRIBER_ROLE_ID);
      });
    }

    await interaction.reply({
      content: "Your account has successfully been verified!",
      ephemeral: true,
    });
  },
};

function getRolesForLevel(level) {
  return levelToRoleMap[level] || [];
}
