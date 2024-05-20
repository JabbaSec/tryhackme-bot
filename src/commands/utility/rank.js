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

    if (
      interaction.channel &&
      interaction.channel.id === process.env.BOT_COMMANDS
    ) {
      await interaction.deferReply({ ephemeral: false });
    } else {
      await interaction.deferReply({ ephemeral: true });
    }

    if (username && username.length > 30) {
      return await interaction.editReply({
        content:
          "Your input exceeds the username character limit. Please try again.",
        ephemeral: true,
      });
    }

    try {
      const userProfile = await client.handleAPI.get_user_data(username);
      if (
        !userProfile ||
        userProfile.userRank == 0 ||
        userProfile.userRank == undefined ||
        userProfile.points === "undefined" ||
        userProfile.points === undefined
      ) {
        return interaction.editReply({
          content: "User not found.",
          ephemeral: true,
        });
      }

      const tryhackme_url = "https://tryhackme.com/p/";
      const rankEmbed = new EmbedBuilder()
        .setColor("#5865F2")
        .setTitle(userProfile.username || username)
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

      await interaction.editReply({
        embeds: [rankEmbed],
      });
    } catch (error) {
      console.error("Error in rank command:", error);
      await interaction.editReply({
        content: "An error occurred while processing your request.",
        ephemeral: true,
      });
    }
  },
};
