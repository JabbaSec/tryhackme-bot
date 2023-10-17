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
    let verifiedCheck = await UserProfile.findOne({
      discordId: interaction.user.id,
    });

    const tokenApiData = await client.handleAPI.get_user_by_token(token);
    if (!tokenApiData || !tokenApiData.username) {
      console.error("Received invalid data from the API:", tokenApiData);
      return;
    }

    const userApiData = await client.handleAPI.get_user_data(
      tokenApiData.username
    );

    if (userProfile) {
      if (userProfile.discordId == interaction.user.id) {
        userProfile.username = tokenApiData.username;
        userProfile.token = token;
        userProfile.subscribed = tokenApiData.subscribed == "1" ? true : false;
        userProfile.rank = userApiData.userRank;
        userProfile.points = userApiData.points;
        userProfile.level = tokenApiData.level;
        userProfile.avatar = tokenApiData.avatar;
        await userProfile.save().catch(console.error);

        const member = await fetchMember(guild, interaction.user.id);
        if (member) {
          assignRoles(member, tokenApiData);
        }

        return interaction.reply({
          content: "Your profile has been updated!",
          ephemeral: true,
        });
      } else if (userProfile.discordId !== interaction.user.id) {
        return interaction.reply({
          content:
            "This token is already in use. If you are trying to link a new account, you will need to contact a moderator in the Discord server.",
          ephemeral: true,
        });
      }
    }

    if (verifiedCheck) {
      return interaction.reply({
        content:
          "Your account has already been verified. If you are trying to link a new account, you will need to contact a moderator in the Discord server.",
        ephemeral: true,
      });
    }

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
