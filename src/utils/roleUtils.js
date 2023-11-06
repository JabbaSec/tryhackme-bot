const levelToRoleMap = {
  1337: process.env.LEVEL_EVENT,
  999: process.env.LEVEL_BUG_HUNTER,
  998: process.env.LEVEL_13,
  997: process.env.LEVEL_13,
  13: process.env.LEVEL_13,
  12: process.env.LEVEL_12,
  11: process.env.LEVEL_11,
  10: process.env.LEVEL_10,
  9: process.env.LEVEL_9,
  8: process.env.LEVEL_8,
  7: process.env.LEVEL_7,
  6: process.env.LEVEL_6,
  5: process.env.LEVEL_5,
  4: process.env.LEVEL_4,
  3: process.env.LEVEL_3,
  2: process.env.LEVEL_2,
  1: process.env.LEVEL_1,
};

function assignRoles(member, apiData) {
  if (apiData.level) {
    const roleToAdd = getRolesForLevel(apiData.level);

    member.roles.add(process.env.VERIFIED_ROLE_ID);

    // Remove other level roles
    for (const role of Object.values(levelToRoleMap)) {
      if (member.roles.cache.has(role) && role !== roleToAdd) {
        member.roles.remove(role);
      }
    }

    // Add the new role
    if (roleToAdd) {
      member.roles.add(roleToAdd);
    }
  }

  if (apiData.subscribed == 1) {
    member.roles.add(process.env.SUBSCRIBER_ROLE_ID);
  } else {
    member.roles.remove(process.env.SUBSCRIBER_ROLE_ID);
  }
}

function getRolesForLevel(level) {
  return levelToRoleMap[level] || null;
}

module.exports = {
  assignRoles,
  getRolesForLevel,
};
