const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Returns the API and Client latency"),

  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });

    const pingEmbed = new EmbedBuilder()
      .setTitle("Pong!")
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp(Date.now())
      .setFields(
        {
          name: "API Latency",
          value: `${client.ws.ping}ms`,
        },
        {
          name: "Client Ping",
          value: `${message.createdTimestamp - interaction.createdTimestamp}ms`,
        }
      );

    await interaction.editReply({ embeds: [pingEmbed] });
  },
};
