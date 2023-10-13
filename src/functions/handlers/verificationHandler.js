module.exports = (client) => {
  client.roleSync = async (client) => {
    guild = client.guilds.cache.get("990680847713697873");

    if (!guild.members.cache.has("726943340246859847"))
      console.log(guild.members.cache.has("726943340246859847"));
  };
};
