const { SlashCommandBuilder } = require("discord.js");
const UserProfile = require("../../events/mongo/schema/ProfileSchema");
const { fetchMember } = require("../../utils/memberUtils");
const { assignRoles } = require("../../utils/roleUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Syncs your TryHackMe site account to Discord")
    .addStringOption((option) =>
      option
        .setName("token")
        .setDescription(
          "Use your Discord token from https://tryhackme.com/profile"
        )
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const token = interaction.options.getString("token");
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const discordId = interaction.user.id;

    // Check if the user is already verified
    let userDiscordProfile = await UserProfile.findOne({ discordId });
    if (userDiscordProfile && userDiscordProfile.token !== token) {
      return interaction.reply({
        content:
          "Your Discord account is already linked with a token. If you wish to update your token, please contact a moderator.",
        ephemeral: true,
      });
    }

    // Check if the token is already in use by someone else
    let tokenProfile = await UserProfile.findOne({ token });
    if (tokenProfile && tokenProfile.discordId !== discordId) {
      return interaction.reply({
        content: "This token is already in use by another account.",
        ephemeral: true,
      });
    }

    const userApiData = await client.handleAPI
      .get_token_data(token)
      .catch((error) => {
        console.error("Received invalid data from the API:", error);
        return interaction.reply({
          content:
            "Failed to verify your account. Please ensure your token is correct.",
          ephemeral: true,
        });
      });

    if (!userApiData || !userApiData.success)
      return interaction.reply({
        content:
          "Failed to verify your account. Please ensure your token is correct.",
        ephemeral: true,
      });

    let userProfile = userDiscordProfile || new UserProfile({ discordId });
    userProfile = updateUserProfile(userProfile, userApiData, token);
    await userProfile.save().catch(console.error);

    const member = await fetchMember(guild, discordId);
    if (member) {
      assignRoles(member, userProfile);
    }

    await interaction.reply({
      content: "Your account has been updated and verified!",
      ephemeral: true,
    });
  },
};

function updateUserProfile(userProfile, userApiData, token) {
  userProfile.username = userApiData.username;
  userProfile.token = token;
  userProfile.subscribed = userApiData.subscribed === 1;
  userProfile.rank = userApiData.usersRank;
  userProfile.points = userApiData.points;
  userProfile.level = userApiData.level;
  userProfile.avatar = userApiData.avatar;

  return userProfile;
}
