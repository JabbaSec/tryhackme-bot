const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Returns the API and Client latency")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Start a giveaway")
        .addIntegerOption((option) =>
          option
            .setName("day")
            .setDescription("Day of the month, 1-31")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("month")
            .setDescription("Month of the year, 1-12")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("year")
            .setDescription("Year must start with 20, 20XX")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("time")
            .setDescription("24-hour time format, 0-23")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("winners")
            .setDescription("Amount of winners to be chosen.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription(
              "Add optional text to go along with giveaway. Use \n for a newline."
            )
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("stop")
        .setDescription("Reroll the winners.")
        .addIntegerOption((option) =>
          option
            .setName("id")
            .setDescription("id of the giveaway you want to stop")
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("announce")
            .setDescription(
              "Whether you want it posted in #community-announcements"
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("stats")
        .setDescription("Reroll the winners.")
        .addIntegerOption((option) =>
          option
            .setName("id")
            .setDescription("id of the giveaway you want to view")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view")
        .setDescription("View the current active giveaway details.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("reroll")
        .setDescription("Reroll the winners.")
        .addIntegerOption((option) =>
          option
            .setName("id")
            .setDescription("id of the giveaway you want to view")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("Amount of winners to be rerolled.")
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    // defer
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
