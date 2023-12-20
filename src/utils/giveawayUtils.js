async function giveawayEnd(id, announce) {
  if (!announce) return;

  try {
    const giveaway = await Giveaway.findById(id);
    if (!giveaway) throw new Error("Giveaway not found");

    const winners = selectRandomWinners(
      giveaway.participants,
      giveaway.winners
    );

    const winnersMention = winners.map((winner) => `<@${winner}>`).join(", ");

    const channel = await client.channels.fetch(process.env.ANNOUNCEMENTS);
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
