const Giveaway = require("../../events/mongo/schema/GiveawaySchema");

module.exports = {
  data: {
    name: "join-giveaway",
  },
  async execute(interaction, client) {
    const userId = interaction.user.id;
    const messageId = interaction.message.id;

    const giveaway = await Giveaway.findOne({ messageId: messageId });

    if (!giveaway) {
      await interaction.reply({
        content: "This giveaway does not exist or has ended.",
        ephemeral: true,
      });
      return;
    }

    if (giveaway.participants.includes(userId)) {
      await interaction.reply({
        content: "You have already joined this giveaway!",
        ephemeral: true,
      });
      return;
    }

    giveaway.participants.push(userId);
    await giveaway.save();

    await interaction.reply({
      content: "You have successfully joined the giveaway!",
      ephemeral: true,
    });
  },
};
