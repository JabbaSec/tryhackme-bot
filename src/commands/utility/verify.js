const { SlashCommandBuilder } = require("discord.js");
const UserProfile = require("../../events/mongo/schema/ProfileSchema");
const { fetchMember } = require("../../utils/memberUtils");
const { assignRoles } = require("../../utils/roleUtils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Syncs your TryHackMe site account to Discord")
    .addStringOption((option) =>
      option
        .setName("token")
        .setDescription("Your Discord token from https://tryhackme.com/profile")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const token = interaction.options.getString("token");
    const guild = client.guilds.cache.get(process.env.GUILD_ID);

    let userProfile = await UserProfile.findOne({ token });

    if (userProfile) {
      return interaction.reply({
        content: "You are already verified!",
        ephemeral: true,
      });
    }

    const tokenApiData = await client.handleAPI.get_user_by_token(token);

    if (!tokenApiData || !tokenApiData.username) {
      console.error("Received invalid data from the API:", tokenApiData);
      return;
    }

    const userApiData = await client.handleAPI.get_user_data(
      tokenApiData.username
    );

    const verify = new UserProfile({
      discordId: interaction.user.id,
      username: tokenApiData.username,
      token: token,
      subscribed: tokenApiData.subscribed == "1" ? true : false,
      rank: userApiData.userRank,
      points: userApiData.points,
      level: tokenApiData.level,
      avatar: tokenApiData.avatar,
    });

    await verify.save().catch(console.error);

    const member = await fetchMember(guild, interaction.user.id);
    if (member) {
      assignRoles(member, tokenApiData);
    }

    await interaction.reply({
      content: "Your account has successfully been verified!",
      ephemeral: true,
    });
  },
};
