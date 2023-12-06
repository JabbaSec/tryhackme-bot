const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Returns the API and Client latency")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("start")
        .setDescription("Start a giveaway")
        .addIntegerOption((option) =>
          option
            .setName("winners")
            .setDescription("Amount of winners to be won.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("reroll")
        .setDescription("Reroll the winners.")
        .addIntegerOption((option) =>
          option
            .setName("winners")
            .setDescription("Amount of winners to be rerolled.")
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    return;
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
