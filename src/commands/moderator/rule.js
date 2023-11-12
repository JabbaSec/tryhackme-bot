const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rule")
    .setDescription("Quote a rule from the Discord server"),
  async execute(interaction) {
    // finish

    switch (subcommand) {
      case "github":
        text = "https://github.com/JabbaSec/tryhackme";
        description = "Get the bot's GitHub link.";
        break;
    }

    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle(
        `TryHackMe's ${
          subcommand.charAt(0).toUpperCase() + subcommand.slice(1)
        }`
      )
      .setDescription(description)
      .addFields({
        name: "\u200B",
        value: text,
      })
      .setFooter({
        text: "TryHackMe Socials",
        iconURL: "https://assets.tryhackme.com/img/favicon.png",
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
