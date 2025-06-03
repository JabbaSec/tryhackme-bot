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
    await interaction.deferReply({ ephemeral: true });

    const token = interaction.options.getString("token");
    const discordId = interaction.user.id;
    const guild = client.guilds.cache.get(process.env.GUILD_ID);

    let existingProfile = await UserProfile.findOne({ discordId });

    // Check if this user already linked with a different token
    if (existingProfile && existingProfile.token !== token) {
      return interaction.editReply({
        content:
          "Your Discord account is already linked with a token. If you wish to update your token, please contact a moderator.",
      });
    }

    // Check if token is already used by someone else
    const duplicateTokenProfile = await UserProfile.findOne({ token });
    if (
      duplicateTokenProfile &&
      duplicateTokenProfile.discordId !== discordId
    ) {
      return interaction.editReply({
        content: "This token is already in use by another account.",
      });
    }

    // Fetch API data
    let userApiData;
    try {
      userApiData = await client.handleAPI.get_token_data(token);
    } catch (error) {
      console.error("Error calling get_token_data:", error);
      return interaction.editReply({
        content:
          "Failed to verify your account. Please ensure your token is correct.",
      });
    }

    if (!isValidApiData(userApiData)) {
      return interaction.editReply({
        content:
          "Failed to verify your account. Please ensure your token is correct.",
      });
    }

    // Save profile
    let userProfile = existingProfile || new UserProfile({ discordId });
    const hasUpdated = updateProfileFromApiData(
      userProfile,
      userApiData,
      token
    );
    if (hasUpdated) {
      await userProfile.save().catch(console.error);
    }

    // Assign roles
    const member = await fetchMember(guild, discordId);
    if (member) {
      await assignRoles(member, userApiData);
    } else {
      console.warn(`Could not fetch member for ${discordId}`);
    }

    return interaction.editReply({
      content: "Your account has been updated and verified!",
    });
  },
};

function isValidApiData(data) {
  return data && data.success;
}

function updateProfileFromApiData(profile, apiData, token) {
  const { username, subscribed, level, avatar, certifications } = apiData;

  profile.username = username;
  profile.token = token;
  profile.subscribed = subscribed === 1;
  profile.level = level;
  profile.avatar = avatar;

  if (certifications && typeof certifications === "object") {
    const newCerts = Object.keys(certifications).filter(
      (key) => certifications[key]
    );
    profile.certifications = newCerts;
  } else {
    profile.certifications = [];
  }

  return profile.isModified();
}
