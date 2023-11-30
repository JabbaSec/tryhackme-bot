const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("docs")
    .setDescription("Search for a document on our knowledge base")
    .addStringOption((option) =>
      option
        .setName("search")
        .setDescription("find an article by its title")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("mention")
        .setDescription("Optionally mention a user with the response.")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    await interaction.deferReply({});

    const search = interaction.options.getString("search");

    if (search && search.length > 100) {
      return await interaction.editReply({
        content: "Your input exceeds the character limit. Please try again.",
        ephemeral: true,
      });
    }

    let article;
    try {
      article = await client.handleAPI.get_article_by_phrase(search);
    } catch (error) {
      console.error("Error fetching article:", error);
      return await interaction.editReply({
        content:
          "An error occurred while fetching the article. Please try again later.",
        ephemeral: true,
      });
    }

    if (article === null) {
      return await interaction.editReply({
        content: "I could not find an article, please try again.",
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(article.title)
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp(Date.now())
      .addFields({
        name: "Article Link",
        value: `${article.url}`,
      });

    const messageContent = user ? `${user}` : "";

    await interaction.editReply({ content: messageContent, embeds: [embed] });
  },
};
