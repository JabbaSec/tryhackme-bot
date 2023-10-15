const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const UserProfile = require("../../events/mongo/schema/ProfileSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Syncs your TryHackMe site account to Discord")
    .addUserOption((option) =>
      option.setName("user").setDescription("Ignore").setRequired(true)
    ),

  async execute(interaction, client) {
    const verify = new UserProfile({
      discordId: interaction.options.getUser("user").id,
      thmUsername: "Jabba",
      token: "Jabba",
      subscriptionStatus: true,
      rank: "0x2",
      points: "100",
      level: "2",
    });

    await verify.save().catch(console.error);

    await interaction.reply({ content: "Done!" });
  },
};
