const Giveaway = require("../events/mongo/schema/GiveawaySchema");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

async function giveawayEnd(client, id, announce) {
  try {
    const giveaway = await Giveaway.findById(id);
    if (!giveaway) throw new Error("Giveaway not found");

    // Check if the giveaway has already concluded
    if (giveaway.concluded) {
      console.log(`Giveaway with ID ${id} has already concluded.`);
      return;
    }

    const channel = await client.channels.fetch(
      process.env.COMMUNITY_ANNOUNCEMENTS
    );
    const message = await channel.messages.fetch(giveaway.messageId);

    const disabledButton = new ButtonBuilder()
      .setCustomId("join-giveaway")
      .setLabel("Join Giveaway")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true);

    const newRow = new ActionRowBuilder().addComponents(disabledButton);
    await message.edit({ components: [newRow] });

    // Select winners
    const winners = selectRandomWinners(
      giveaway.participants,
      giveaway.winners
    );
    let winnersMention =
      winners.length > 0
        ? winners.map((winner) => `<@${winner}>`).join(", ")
        : "No winners, not enough participants.";

    // Announce winners if required
    if (announce) {
      channel.send(
        `The giveaway is over!\n\nHere are the winners:\n${winnersMention}`
      );
    }

    // Update the giveaway as concluded in the database
    giveaway.concluded = true;
    await giveaway.save();
  } catch (error) {
    console.error("Error in giveawayEnd function:", error);
  }
}

function selectRandomWinners(participants, winnersCount) {
  const shuffled = participants.sort(() => 0.5 - Math.random());
  // Select up to the number of winners or all participants if fewer than desired winners
  return shuffled.slice(0, Math.min(winnersCount, participants.length));
}

module.exports = {
  giveawayEnd,
};
