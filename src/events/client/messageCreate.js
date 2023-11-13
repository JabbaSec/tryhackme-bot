const TOKEN_PATTERN = /[a-f0-9]{24}/;

module.exports = {
  name: "messageCreate",

  async execute(message, client) {
    // Attempt to detect a token being sent and remove it
    if (TOKEN_PATTERN.test(message.content)) {
      try {
        await message.delete();
        const userId = message.author.id;

        message.channel.send(
          `<@${userId}>, Oops! It looks like you sent something similar to a TryHackMe Discord Token, I have removed your message to be safe.\nIf this was a mistake, please let <@${process.env.BOT_DEVELOPER_ID}> know what your message was.`
        );
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  },
};