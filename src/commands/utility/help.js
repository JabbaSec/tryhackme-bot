const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Information on how to use the bot!"),

  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });

    const pingEmbed = new EmbedBuilder()
      .setTitle("Information")
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp(Date.now())
      .setFields({
        name: "Discord Slash Commands",
        value: `https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ`,
      });

    await interaction.editReply({ embeds: [pingEmbed] });
  },
};
