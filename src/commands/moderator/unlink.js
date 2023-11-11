const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const UserProfile = require("../../events/mongo/schema/ProfileSchema");
const { fetchMember } = require("../../utils/memberUtils");
const { removeRoles } = require("../../utils/roleUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlink")
    .setDescription("Detaches a Discord account from a TryHackMe token.")
    .addStringOption((option) =>
      option
        .setName("token")
        .setDescription("If you do not have the users token, use /lookup!")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const token = interaction.options.getString("token");

    const hasPermission = await client.checkPermissions(
      interaction,
      "Moderator"
    );
    if (!hasPermission) return;

    // Fetch user profile from database
    let userProfile = await UserProfile.findOne({ token });

    // Check if the user profile exists and the token matches
    if (!userProfile || userProfile.token !== token) {
      return interaction.reply({
        content:
          "No linked account found with this token, or token does not match.\nEnsure that there are no spaces before or after the token.",
        ephemeral: true,
      });
    }

    const discordId = userProfile.discordId;

    // Remove the user's data from the database
    await UserProfile.deleteOne({ token });

    // Remove roles from the user if they have them
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const member = await fetchMember(guild, discordId);

    if (member) {
      removeRoles(member);
    }

    // Send a confirmation message with the user mention
    await interaction.reply({
      content: `<@${discordId}> has been successfully unlinked.`,
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
        { name: "User", value: `<@${discordId}>`, inline: true },
        { name: "Token", value: `removed_for_dev`, inline: true },
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
