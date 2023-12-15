const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const {
  checkDate,
  createTimer,
  getTimeoutDuration,
} = require("../../utils/timerUtils.js");

const Giveaway = require("../../events/mongo/schema/GiveawaySchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Returns the API and Client latency")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
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
    const hasPermission = await client.checkPermissions(
      interaction,
      "Administrator"
    );
    if (!hasPermission) return;

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "create":
        const day = interaction.options.getInteger("day");
        const month = interaction.options.getInteger("month");
        const year = interaction.options.getInteger("year");
        const time = interaction.options.getInteger("time");
        const winners = interaction.options.getInteger("winners");
        const description = interaction.options.getString("description");

        const endDate = await checkDate(day, month, year, time);
        if (!endDate) {
          await interaction.reply("Invalid date provided.");
          return;
        }

        const duration = await getTimeoutDuration(endDate);
        if (duration <= 0) {
          await interaction.reply("The specified time is in the past.");
          return;
        }

        const giveaway = await Giveaway.create({
          endDate,
          winners,
          participants: [],
        });

        const timerCallback = () => {
          console.log(`Giveaway ended for giveaway ID ${giveaway._id}`);
        };

        if (await createTimer(client, duration, timerCallback, giveaway._id)) {
          await interaction.reply(`Giveaway created with ID ${giveaway._id}.`);
        } else {
          await interaction.reply("Failed to create a timer for the giveaway.");
        }

      default:
        break;
    }
  },
};
