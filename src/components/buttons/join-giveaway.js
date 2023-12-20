module.exports = {
  data: {
    name: "join-giveaway",
  },
  async execute(interaction, client) {
    await interaction.reply({ content: "Pong." });
  },
};
