const levelToRoleMap = {
  1337: process.env.LEVEL_EVENT,
  999: process.env.LEVEL_BUG_HUNTER,
  998: process.env.LEVEL_CONTRIBUTOR,
  997: process.env.LEVEL_13,
  21: process.env.LEVEL_21,
  20: process.env.LEVEL_20,
  19: process.env.LEVEL_19,
  18: process.env.LEVEL_18,
  17: process.env.LEVEL_17,
  16: process.env.LEVEL_16,
  15: process.env.LEVEL_15,
  14: process.env.LEVEL_14,
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

const certificationToRoleMap = {
  sal1: process.env.SAL1_ROLE_ID,
  pt1: process.env.PT1_ROLE_ID,
};

async function assignRoles(member, apiData) {
  // Level roles
  if (apiData.level) {
    const roleToAdd = getRolesForLevel(apiData.level);
    await member.roles.add(process.env.VERIFIED_ROLE_ID);

    for (const role of Object.values(levelToRoleMap)) {
      if (member.roles.cache.has(role) && role !== roleToAdd) {
        await member.roles.remove(role);
      }
    }

    if (roleToAdd) {
      await member.roles.add(roleToAdd);
    }
  }

  // Subscriber role
  if (apiData.subscribed == 1) {
    await member.roles.add(process.env.SUBSCRIBER_ROLE_ID);
  } else {
    await member.roles.remove(process.env.SUBSCRIBER_ROLE_ID);
  }

  // Certification roles
  if (apiData.certifications) {
    for (const [cert, roleId] of Object.entries(certificationToRoleMap)) {
      const hasCertInApi = !!apiData.certifications[cert];
      const hasRole = await member.roles.cache.has(roleId);

      if (hasCertInApi && !hasRole) {
        await member.roles.add(roleId);

        try {
          await member.send(
            `🎉 You’ve just been awarded the **${cert.toUpperCase()}** certification role on the TryHackMe Discord! Great job!`
          );
        } catch (err) {
          console.log(
            `Could not DM ${
              member.user.tag
            } about gaining ${cert.toUpperCase()} role.`
          );
        }
      } else if (!hasCertInApi && hasRole) {
        await member.roles.remove(roleId);

        try {
          await member.send(
            `Your **${cert.toUpperCase()}** certification role has been removed on the TryHackMe Discord. If you believe this is an error, please re-link your account or contact jabba.sh.`
          );
        } catch (err) {
          console.log(
            `Could not DM ${
              member.user.tag
            } about losing ${cert.toUpperCase()} role.`
          );
        }
      }
    }
  }
}

async function removeRoles(member) {
  // Remove verified role
  await member.roles.remove(process.env.VERIFIED_ROLE_ID);

  // Remove subscriber role
  await member.roles.remove(process.env.SUBSCRIBER_ROLE_ID);

  // Remove level roles
  for (const role of Object.values(levelToRoleMap)) {
    if (member.roles.cache.has(role)) {
      await member.roles.remove(role);
    }
  }

  // Remove certification roles
  for (const [cert, roleId] of Object.entries(certificationToRoleMap)) {
    if (member.roles.cache.has(roleId)) {
      await member.roles.remove(roleId);

      try {
        await member.send(
          `Your **${cert.toUpperCase()}** certification role has been removed on the TryHackMe Discord. If you believe this is an error, please re-link your account or contact jabba.sh.`
        );
      } catch (err) {
        console.log(
          `Could not DM ${
            member.user.tag
          } about losing ${cert.toUpperCase()} role.`
        );
      }
    }
  }
}

function getRolesForLevel(level) {
  return levelToRoleMap[level] || null;
}

module.exports = {
  assignRoles,
  getRolesForLevel,
  removeRoles,
};
