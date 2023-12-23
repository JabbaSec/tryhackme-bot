const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ollie")
    .setDescription("Retrieves a special picture"),

  async execute(interaction, client) {
    await interaction.deferReply();

    const pictureUrl = await client.handleAPI.get_ollie_picture();
    if (!pictureUrl) {
      return interaction.editReply("Failed to retrieve the picture.");
    }

    const ollieEmbed = new EmbedBuilder()
      .setTitle("Ollie")
      .setColor("#5865F2") // Discord's blurple color
      .setImage(pictureUrl)
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setFooter({
        text: "Ollie Unix Montgomery - Rest in Peace, 5th of January, 2023",
      });

    await interaction.editReply({ embeds: [ollieEmbed] });
  },
};
