const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const UserProfile = require("../../events/mongo/schema/ProfileSchema");

const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lookup")
    .setDescription("Looks up a linked account by token or user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("token")
        .setDescription("Looks up by TryHackMe token.")
        .addStringOption((option) =>
          option
            .setName("token")
            .setDescription("The TryHackMe token to lookup.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Looks up by Discord user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The Discord user to lookup.")
            .setRequired(true)
        )
    ),

  async execute(interaction, client) {
    const subcommand = interaction.options.getSubcommand();
    let userProfile;
    notFoundMessage = "No Discord account linked with this TryHackMe token.";

    const hasPermission = await client.checkPermissions(
      interaction,
      "Moderator"
    );
    if (!hasPermission) return;

    if (subcommand === "token") {
      const token = interaction.options.getString("token");
      userProfile = await UserProfile.findOne({ token }).exec();
    } else if (subcommand === "user") {
      const user = interaction.options.getUser("user");
      userProfile = await UserProfile.findOne({ discordId: user.id }).exec();
    }

    if (!userProfile) {
      return await interaction.reply({
        content: notFoundMessage,
        ephemeral: true,
      });
    }

    const deleted = await axios
      .get(`https://tryhackme.com/p/${userProfile.username}`)
      .then((res) =>
        res.request.path == "/r/not-found" ? "Deleted" : "Active"
      )
      .catch((err) => console.log(err));

    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setAuthor({
        name: `TryHackMe`,
        iconURL: `https://tryhackme.com/img/favicon.png`,
      })
      .setThumbnail(userProfile.avatar)
      .setTimestamp()
      .addFields([
        {
          name: "Discord Mention",
          value: `<@${userProfile.discordId}>`,
          inline: true,
        },
        { name: "Discord ID", value: userProfile.discordId, inline: true },
        { name: "THM Token", value: `removed_for_dev`, inline: true },
        {
          name: "THM Username",
          value: `[${userProfile.username}](<https://tryhackme.com/p/${userProfile.username}>)`,
          inline: true,
        },
        { name: "THM Level", value: userProfile.level, inline: true },
        {
          name: "Subscription Status",
          value: `${userProfile.subscribed}`,
          inline: true,
        },
        {
          name: "Account Status",
          value: `${deleted}`,
          inline: true,
        },
      ]);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
