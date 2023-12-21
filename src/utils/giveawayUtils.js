const Giveaway = require("../events/mongo/schema/GiveawaySchema");

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

async function giveawayEnd(client, id, announce) {
  if (!announce) return;

  try {
    const giveaway = await Giveaway.findById(id);
    if (!giveaway) throw new Error("Giveaway not found");

    const channel = await client.channels.fetch(process.env.BOT_LOGGING);
    const message = await channel.messages.fetch(giveaway.messageId);

    console.log(1);

    const disabledButton = new ButtonBuilder()
      .setCustomId("join-giveaway")
      .setLabel("Join Giveaway")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true);

    const newRow = new ActionRowBuilder().addComponents(disabledButton);

    await message.edit({ components: [newRow] });

    const winners = selectRandomWinners(
      giveaway.participants,
      giveaway.winners
    );

    const winnersMention = winners.map((winner) => `<@${winner}>`).join(", ");

    channel.send(
      `The giveaway is over!\n\nHere are the winners:\n${winnersMention}`
    );
  } catch (error) {
    console.error("Error in giveawayEnd function:", error);
  }
}

function selectRandomWinners(participants, winnersCount) {
  const shuffled = participants.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, winnersCount);
}
module.exports = {
  giveawayEnd,
};
