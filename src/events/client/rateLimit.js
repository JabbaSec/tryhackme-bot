module.exports = {
  name: "rateLimit",
  async execute(info, client) {
    console.error(
      `Rate Limit Hit: Request on ${info.route} with limit ${info.limit}`
    );
    console.error(`Timeout: ${info.timeout}ms`);
    console.error(`Global: ${info.global}`);
  },
};
