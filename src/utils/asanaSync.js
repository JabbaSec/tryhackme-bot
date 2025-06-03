const axios = require("axios");
const client = require("../../src/index"); // Make sure your bot exports client

const ASANA_TOKEN = process.env.ASANA_ACCESS_TOKEN;
const ASANA_PROJECT_ID = process.env.ASANA_PROJECT_ID;
const ASANA_WORKSPACE_GID = process.env.ASANA_WORKSPACE;

// Called when a Discord thread is created in a forum
async function sendThreadToAsana(threadData) {
  try {
    const res = await axios.post(
      "https://app.asana.com/api/1.0/tasks",
      {
        data: {
          workspace: ASANA_WORKSPACE_GID,
          name: threadData.name,
          notes:
            `Discord Thread ID: ${threadData.id}\n` +
            `Thread URL: ${threadData.url}\n` +
            `Author ID: ${threadData.authorId}\n` +
            `Created At: ${threadData.createdAt}\n\n` +
            `Message: ${threadData.content}`,
          projects: [ASANA_PROJECT_ID],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ASANA_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✅ Thread synced to Asana: ${res.data.data.gid}`);
  } catch (err) {
    console.error(
      "❌ Failed to create Asana task:",
      err?.response?.data || err.message
    );
  }
}

// Called from webhook when an Asana task is completed
async function handleAsanaWebhookEvent(event) {
  if (event.resource.resource_type !== "task") return;

  const taskId = event.resource.gid;

  try {
    const taskRes = await axios.get(
      `https://app.asana.com/api/1.0/tasks/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${ASANA_TOKEN}`,
        },
      }
    );

    const task = taskRes.data.data;
    if (!task.completed) return;

    const match = task.notes.match(/Discord Thread ID: (\d+)/);
    const threadId = match?.[1];
    if (!threadId) {
      console.warn("⚠️ No Discord thread ID found in task notes.");
      return;
    }

    await closeDiscordThread(threadId);
  } catch (err) {
    console.error(
      "❌ Error handling Asana webhook event:",
      err?.response?.data || err.message
    );
  }
}

// Closes and tags a Discord thread after Asana task completion
async function closeDiscordThread(threadId) {
  try {
    const thread = await client.channels.fetch(threadId);
    if (!thread?.isThread()) return;

    // Reopen the thread if it's archived
    if (thread.archived) {
      await thread.setArchived(false);
    }

    await thread.send(
      "✅ This thread has been marked as resolved in Asana and will now be closed."
    );

    // Apply the "closed" tag if available
    const closedTag = thread.parent.availableTags.find(
      (tag) => tag.name.toLowerCase() === "closed"
    );
    if (closedTag) {
      await thread.setAppliedTags([closedTag.id]);
    }

    await thread.setArchived(true);
    console.log(`📁 Thread "${thread.name}" marked closed and archived.`);
  } catch (err) {
    console.error("❌ Failed to close Discord thread:", err.message);
  }
}

module.exports = {
  sendThreadToAsana,
  handleAsanaWebhookEvent,
};
