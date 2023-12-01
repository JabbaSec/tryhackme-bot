const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("notifyme")
    .setDescription("Toggle announcements notifications.")
    .setDMPermission(false),

  async execute(interaction, client) {
    try {
      let content;

      const roleID = process.env.ANNOUNCEMENTS_ROLE_ID;
      if (!roleID) {
        console.log(
          "ANNOUNCEMENTS_ROLE_ID is not set in environment variables."
        );
        return interaction.reply({
          content: "Role ID is not configured.",
          ephemeral: true,
        });
      }

      const member = await interaction.guild.members.fetch(interaction.user.id);
      if (!member) {
        return interaction.reply({
          content:
            "Member not found in the guild. Please try again in 15 minutes.",
          ephemeral: true,
        });
      }

      if (member.roles.cache.has(roleID)) {
        await member.roles.remove(roleID);
        content = "You will no longer receive announcements notifications.";
      } else {
        await member.roles.add(roleID);
        content = "You will now receive announcements notifications.";
      }

      await interaction.reply({ content: content, ephemeral: true });
    } catch (error) {
      console.error("Error in notifyme command:", error);
      await interaction.reply({
        content: "An error occurred while processing your request.",
        ephemeral: true,
      });
    }
  },
};
