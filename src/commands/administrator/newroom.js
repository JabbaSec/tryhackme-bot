const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("newroom")
    .setDescription("Returns the API and Client latency"),

  async execute(interaction, client) {
    await interaction.deferReply({
      ephemeral: false,
    });

    const hasPermission = await client.checkPermissions(
      interaction,
      "Administrator",
      true
    );
    if (!hasPermission) return;

    room = await client.handleAPI.get_room_data("historyofmalware");
    console.log(room);

    const pingEmbed = new EmbedBuilder()
      .setTitle("Pong!")
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp(Date.now())
      .setFields({
        name: "API Latency",
        value: `ms`,
      });

    await interaction.editReply({ embeds: [pingEmbed] });
  },
};
