const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const UserProfile = require("../../events/mongo/schema/ProfileSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Get the TryHackMe rank of a user.")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("The username to retrieve the rank for.")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const username = interaction.options.getString("username");

    let userProfile;
    let ephemeralCheck = true;

    if (interaction.channel.id === process.env.BOT_COMMANDS)
      ephemeralCheck = false;

    // Check character limit
    if (username) {
      if (username.length > 30) {
        return await interaction.reply({
          content:
            "Your input exceeds the username character limit. Please try again.",
          ephemeral: true,
        });
      }
    }

    // If the user is not in the database, use the get_user_data function
    userProfile = await client.handleAPI.get_user_data(username);
    if (!userProfile) {
      await interaction.reply({
        content: "User not found.",
        ephemeral: true,
      });
      return;
    } else if (
      userProfile.userRank == 0 ||
      userProfile.points === "undefined"
    ) {
      await interaction.reply({
        content: "User not found.",
        ephemeral: true,
      });
      return;
    }

    const tryhackme_url = "https://tryhackme.com/p/";

    const rankEmbed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle(userProfile.username || username) // Use the provided username or the one from the database
      .addFields(
        {
          name: "Leaderboard Position",
          value: `${userProfile.rank || userProfile.userRank}`,
        },
        {
          name: "Username",
          value: `[${userProfile.username || username}](${tryhackme_url}${
            userProfile.username || username
          })`,
          inline: true,
        },
        { name: "Points", value: String(userProfile.points), inline: true },
        {
          name: "Subscribed?",
          value: userProfile.subscribed ? "Yes" : "No",
          inline: true,
        }
      )
      .setThumbnail(userProfile.avatar);

    await interaction.reply({ embeds: [rankEmbed], ephemeral: ephemeralCheck });
  },
};
