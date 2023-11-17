const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("notifyme")
    .setDescription("Toggle announcements notifications."),

  async execute(interaction, client) {
    let content;

    const roleID = process.env.ANNOUNCEMENTS_ROLE_ID;
    const member = interaction.member;

    if (member.roles.cache.has(roleID)) {
      await member.roles.remove(roleID);
      content = "You will no longer receive announcements notifications.";
    } else {
      await member.roles.add(roleID);
      content = "You will now receive announcements notifications.";
    }

    await interaction.reply({ content: content, ephemeral: true });
  },
};
