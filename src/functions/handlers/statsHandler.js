const UserProfile = require("../../events/mongo/schema/ProfileSchema");

module.exports = (client) => {
  client.updateStats = async () => {
    console.log("Stats");
    const guild = client.guilds.cache.get(process.env.GUILD_ID);

    const statsApiData = await client.handleAPI.get_site_statistics();
    console.log(statsApiData);
    console.log(guild.memberCount);

    try {
      if (statsApiData.totalUsers !== undefined) {
        client.channels.cache
          .get(process.env.THM_USERS)
          .setName(`THM Users: ${statsApiData.totalUsers}`);
      }
    } catch (err) {
      console.log("There was an issue with updating the total users.");
    }

    try {
      client.channels.cache
        .get(process.env.THM_ROOMS)
        .setName(`Total Rooms: ${statsApiData.publicRooms}`);
    } catch (err) {
      console.log("There was an issue with updating the public rooms.");
    }

    try {
      client.channels.cache
        .get(process.env.DISCORD_USERS)
        .setName(`Discord Users: ${guild.memberCount}`);
    } catch (err) {
      console.log("There was an issue with updating the discord users.");
    }

    console.log("Successfully updated the statistics");
  };
};
