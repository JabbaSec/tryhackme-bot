module.exports = (client) => {
  client.checkPermissions = async (interaction, role) => {
    const member = interaction.member;

    if (member.id === process.env.BOT_DEVELOPER_ID) return true;

    const verified = member.roles.cache.has(process.env.VERIFIED_ROLE_ID);
    const moderator = member.roles.cache.has(process.env.MODERATOR_ROLE_ID);
    const admin = member.roles.cache.has(process.env.ADMIN_ROLE_ID);
    const owner = member.roles.cache.has(process.env.OWNER_ROLE_ID);

    switch (role) {
      case "Verified":
        if (verified || moderator || admin || owner) {
          return true;
        } else {
          await interaction.reply({
            content: "You are not Verified.",
            ephemeral: true,
          });
          return false;
        }

      case "Moderator":
        if (moderator || admin || owner) {
          return true;
        } else {
          await interaction.reply({
            content: "You are not a Moderator.",
            ephemeral: true,
          });
          return false;
        }

      case "Administrator":
        if (admin || owner) {
          return true;
        } else {
          await interaction.reply({
            content: "You are not an Administrator.",
            ephemeral: true,
          });
          return false;
        }

      case "Owner":
        if (owner) {
          return true;
        } else {
          await interaction.reply({
            content: "You are not an Owner.",
            empheral: true,
          });
        }

      default:
        console.error(`Invalid role specified in checkPermissions: ${role}`);
        await interaction.reply({
          content: "An error occurred while checking permissions.",
          ephemeral: true,
        });
        return false;
    }
  };
};
