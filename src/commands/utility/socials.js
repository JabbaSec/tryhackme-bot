const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("socials")
    .setDescription("Get the latest information for TryHackMe's social media!")
    .addSubcommand((subcommand) =>
      subcommand.setName("github").setDescription("Get the bot's GitHub link.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("twitter")
        .setDescription("Get TryHackMe's official Twitter!")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("reddit")
        .setDescription("Get the link to our amazing subreddit!")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("website")
        .setDescription("You should know our website by now!")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("discord")
        .setDescription("Looking to invite people to the Discord server?")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("blog")
        .setDescription("Look at the awesome resources written by TryHackMe!")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("shop")
        .setDescription("Get some awesome swag to show off to your friends.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("email")
        .setDescription("TryHackMe's support email address.")
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    let text;
    let description;

    switch (subcommand) {
      case "github":
        text = "https://github.com/JabbaSec/tryhackme";
        description = "Get the bot's GitHub link.";
        break;
      case "twitter":
        text = "https://twitter.com/realtryhackme/";
        description = "Get TryHackMe's official Twitter!";
        break;
      case "reddit":
        text = "https://www.reddit.com/r/tryhackme/";
        description = "Get the link to our amazing subreddit!";
        break;
      case "website":
        text = "https://tryhackme.com/";
        description = "You should know our website by now!";
        break;
      case "discord":
        text = "https://discord.com/invite/tryhackme";
        description = "Looking to invite people to the Discord server?";
        break;
      case "blog":
        text = "https://blog.tryhackme.com/";
        description = "Look at the awesome resources written by TryHackMe!";
        break;
      case "shop":
        text = "https://store.tryhackme.com/";
        description = "Get some awesome swag to show off to your friends.";
        break;
      case "email":
        text = "support@tryhackme.com";
        description = "TryHackMe's support email address.";
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
