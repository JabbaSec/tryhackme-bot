const { ChannelType } = require("discord.js");
const { sendThreadToAsana } = require("../../utils/asanaSync");

module.exports = {
  name: "threadCreate",
  async execute(thread) {
    if (thread.parent?.type !== ChannelType.GuildForum) return;

    if (thread.parent.name !== "test-forum") return;

    const messages = await thread.messages.fetch({ limit: 1, after: "0" });
    const firstMessage = messages.first();

    await sendThreadToAsana({
      id: thread.id,
      name: thread.name,
      url: `https://discord.com/channels/${thread.guild.id}/${thread.id}`,
      createdAt: thread.createdAt,
      authorId: thread.ownerId,
      content: firstMessage?.content || "[No content]",
    });
  },
};
