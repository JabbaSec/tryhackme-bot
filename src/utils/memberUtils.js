async function fetchMember(guild, userId) {
  try {
    return await guild.members.fetch(userId);
  } catch (error) {
    //console.error(`Error fetching member with ID ${userId}: ${error.message}`);
    return null;
  }
}

module.exports = {
  fetchMember,
};
