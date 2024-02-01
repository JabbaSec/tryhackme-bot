const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const { checkDate } = require("../../utils/timerUtils.js");

const Giveaway = require("../../events/mongo/schema/GiveawaySchema");

const { giveawayEnd } = require("../../utils/giveawayUtils");

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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("stop")
        .setDescription("Reroll the winners.")
        .addStringOption((option) =>
          option
            .setName("stop-id")
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
        .addStringOption((option) =>
          option
            .setName("stats-id")
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
        .addStringOption((option) =>
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
        const description = `Click below to join the giveaway! <@&${process.env.ANNOUNCEMENTS_ROLE_ID}>`;

        const endDate = await checkDate(day, month, year, time);
        if (!endDate || endDate < new Date()) {
          await interaction.reply("Invalid date provided.");
          return;
        }

        const button = new ButtonBuilder()
          .setCustomId("join-giveaway")
          .setLabel("Join Giveaway")
          .setStyle(ButtonStyle.Primary);

        const announcementChannel = client.guilds.cache
          .get(process.env.GUILD_ID)
          .channels.cache.get(process.env.COMMUNITY_ANNOUNCEMENTS);

        const giveawayMessage = await announcementChannel
          .send({
            content: description,
            components: [new ActionRowBuilder().addComponents(button)],
          })
          .catch((err) => {
            console.error("[GIVEAWAY] Error sending giveaway message:", err);
            return null;
          });

        if (!giveawayMessage) {
          await interaction.reply("Failed to send giveaway message.");
          return;
        }

        await Giveaway.create({
          endDate,
          winners,
          participants: [],
          messageId: giveawayMessage.id,
          concluded: false,
        });

        await interaction.reply(
          `Giveaway created and will end on ${endDate.toLocaleString()}.`
        );
        break;

      case "stop":
        const stopId = interaction.options.getString("stop-id");
        const announce = interaction.options.getBoolean("announce");

        await giveawayEnd(client, stopId, announce);
        console.log(`Giveaway ended for giveaway ID: ${stopId}`);

        await interaction.reply({
          content: `Successfully ended giveaway: ${stopId}`,
        });

        break;

      case "view":
        const now = new Date();
        const activeGiveaways = await Giveaway.find({
          endDate: { $gte: now },
          concluded: { $ne: true },
        }).sort({ endDate: 1 });

        const giveawayFields = activeGiveaways.map((g, index) => ({
          name: `Giveaway #${index + 1}`,
          value: `Ends on: ${g.endDate.toLocaleString()}\nID: ${g._id}`,
        }));

        if (giveawayFields.length === 0) {
          await interaction.reply("No active giveaways found.");
          break;
        }

        await client.paginationEmbed(interaction, giveawayFields, {
          title: "Active Giveaways",
          color: "#8AC7DB",
          maxPerPage: 5,
        });
        break;

      case "stats":
        const statsId = interaction.options.getString("stats-id");
        let giveawayStats;

        try {
          giveawayStats = await Giveaway.findById(statsId);
          if (!giveawayStats) {
            await interaction.reply(`No giveaway found with ID: ${statsId}`);
            break;
          }

          const statsEmbed = new EmbedBuilder()
            .setColor("#8AC7DB")
            .setTitle(`Giveaway Stats - ID: ${statsId}`)
            .addFields(
              {
                name: "End Date",
                value: giveawayStats.endDate.toLocaleString(),
                inline: true,
              },
              {
                name: "Total Winners",
                value: giveawayStats.winners.toString(),
                inline: true,
              },
              {
                name: "Message ID",
                value: giveawayStats.messageId || "Not Available",
                inline: true,
              },
              {
                name: "Total Participants",
                value: giveawayStats.participants.length.toString(),
                inline: true,
              }
            );

          await interaction.reply({ embeds: [statsEmbed] });
        } catch (err) {
          await interaction.reply({
            content: `An error occurred while retrieving the giveaway: ${err.message}. Please check the ID and try again.`,
          });
          break;
        }
        break;

      case "reroll":
        const rerollId = interaction.options.getString("id");
        const amountToReroll = interaction.options.getInteger("amount");

        const giveawayToReroll = await Giveaway.findById(rerollId);

        if (!giveawayToReroll) {
          await interaction.reply(`No giveaway found with ID: ${rerollId}`);
          break;
        }

        if (amountToReroll <= 0 || amountToReroll > giveawayToReroll.winners) {
          await interaction.reply("Invalid amount to reroll.");
          break;
        }

        const shuffledParticipants = [...giveawayToReroll.participants].sort(
          () => 0.5 - Math.random()
        );
        const newWinners = shuffledParticipants.slice(0, amountToReroll);

        var newWinnersMessage = `New winners for giveaway ID: ${rerollId}\n\n`;
        for (const winner of newWinners) {
          newWinnersMessage += `<@${winner}>\n`;
        }

        await interaction.reply(newWinnersMessage);

        break;

      default:
        break;
    }
  },
};
