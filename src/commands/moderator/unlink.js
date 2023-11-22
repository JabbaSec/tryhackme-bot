const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const UserProfile = require("../../events/mongo/schema/ProfileSchema");
const { fetchMember } = require("../../utils/memberUtils");
const { removeRoles } = require("../../utils/roleUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlink")
    .setDescription("Detaches a Discord account from a TryHackMe token.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Unlink a user via their Discord username")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to be unlinked.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("token")
        .setDescription("Unlink a user via their TryHackMe Discord token.")
        .addStringOption((option) =>
          option
            .setName("token")
            .setDescription("Token attached to their account.")
            .setRequired(true)
        )
    ),

  async execute(interaction, client) {
    const subcommand = interaction.options.getSubcommand();

    const token = interaction.options.getString("token");
    const user = interaction.options.getUser("user");

    let userProfile;

    const hasPermission = await client.checkPermissions(
      interaction,
      "Moderator"
    );
    if (!hasPermission) return;

    // Fetch user profile from database

    switch (subcommand) {
      case "token":
        userProfile = await UserProfile.findOne({ token });

        // Check if the user profile exists and the token matches
        if (!userProfile || userProfile.token !== token) {
          return interaction.reply({
            content:
              "No linked account found with this token, or token does not match.\nEnsure that there are no spaces before or after the token.",
            ephemeral: true,
          });
        }

        // Remove the user's data from the database
        await UserProfile.deleteOne({ token });
        break;

      case "user":
        userProfile = await UserProfile.findOne({ discordId: user.id });

        // Check if the user profile exists
        if (!userProfile) {
          return interaction.reply({
            content: "No linked account found with this user.",
            ephemeral: true,
          });
        }

        // Remove the user's data from the database
        await UserProfile.deleteOne({ discordId: user.id });
        break;

      default:
        break;
    }

    // Remove roles from the user if they have them
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const member = await fetchMember(guild, userProfile.discordId);

    if (member) {
      removeRoles(member);
    }

    // Send a confirmation message with the user mention
    await interaction.reply({
      content: `<@${userProfile.discordId}> has been successfully unlinked.`,
      ephemeral: true,
    });

    const unlinkEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setColor("#FFA500")
      .setTitle(`Account Unlink`)
      .setFields([
        { name: "User", value: `<@${userProfile.discordId}>`, inline: true },
        { name: "Token", value: userProfile.token, inline: true },
      ])
      .setTimestamp();

    // Send the embed to the logging channel
    const loggingChannel = client.guilds.cache
      .get(process.env.GUILD_ID)
      .channels.cache.get(process.env.BOT_LOGGING);
    if (loggingChannel) {
      loggingChannel
        .send({ embeds: [unlinkEmbed] })
        .catch((err) =>
          console.log(
            "[UNLINK] Error with sending the embed to the logging channel."
          )
        );
    }
  },
};
