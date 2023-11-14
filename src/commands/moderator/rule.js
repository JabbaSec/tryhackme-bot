const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rule")
    .setDescription("Quote a rule from the Discord server")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("The rule to be quoted.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const number = interaction.options.getInteger("number");

    const hasPermission = await client.checkPermissions(
      interaction,
      "Moderator"
    );
    if (!hasPermission) return;

    switch (number) {
      case 1:
        text = `No Abusive Language`;
        description =
          "Harassment, bullying, discrimination, or abusive language of any kind is not tolerated. We're here to grow together, share insights, and celebrate wins. No one should ever feel unsafe or threatened.\nKeep your language “safe for work.” If you're not okay with your employer seeing it, don't write it. And who knows, you may meet your future employer here someday!";
        break;

      case 2:
        text = "Keep Discussions Relevant";
        description = "Please keep discussion relevant to the channel topic.";
        break;

      case 3:
        text = "No Advertising";
        description =
          "No excessive self-promotion. While you're welcome to post your write-ups, walkthroughs, and streams of TryHackMe content, spamming of your own channels isn't tolerated. ";
        break;

      case 4:
        text = "No Illegal  or Harmful Activity";
        description =
          "We do not teach unethical hackers. Please don't discuss illegal or unethical topics. Please don't post any intentionally harmful commands or distribute malware.";
        break;

      case 5:
        text = "No Cheating";
        description =
          "Cheating of any form is not allowed. This is not limited to asking for help with assessed schoolwork or exams.";
        break;

      case 6:
        text = "No Spamming";
        description =
          "If your question hasn’t been answered right away, don’t spam. Massive walls of text or many individual messages count as spam. This includes posting the same message across multiple channels.";
        break;

      case 7:
        text = "Use English";
        description =
          "Please keep all communication in English. This also means no encrypted posting.";
        break;

      case 8:
        text = "No DMs Without Consent";
        description =
          "Always ask permission before sending a DM or friend request to another user. ";
        break;

      case 9:
        text = "Follow Server Staff Direction";
        description =
          "Our team are here to protect the interests of the community. Follow their direction at all times.";
        break;

      default:
        text = "Rule Not Found";
        description = "Please ensure you are selecting one listed from #rules";
        break;
    }

    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      // .setTitle(`<#${process.env.RULES}>`)
      .setTitle(`<#${process.env.RULES}> ${number} - ${text}`)
      .setDescription(description)
      // .addFields({
      //   name: `<#${process.env.RULES}>`,
      //   value: description,
      // })
      // .addFields({
      //   name: `Rule ${number} - ${text}`,
      //   value: description,
      // })
      .setFooter({
        text: `TryHackMe Rules`,
        iconURL: "https://assets.tryhackme.com/img/favicon.png",
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
