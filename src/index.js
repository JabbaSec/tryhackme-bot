require("dotenv").config();

const { Client, Collection, GatewayIntentBits } = require("discord.js");

const fs = require("fs");
const mongoose = require("mongoose");

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.buttons = new Collection();
client.dropdowns = new Collection();

client.commandArray = [];
client.timerArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

(async () => {
  mongoose.connect(`${process.env.MONGODB_URI}`).catch(console.error);
})();

client
  .login(process.env.BOT_TOKEN)
  .then(() => {
    try {
      client.handleEvents();
      client.handleCommands();
      client.handleComponents();
      client.roleSync(client);

      // Sync roles every 24 hours
      setInterval(() => {
        client.roleSync(client);
      }, 86400000); // 86,400,000
    } catch (err) {
      console.error(err);
    }
  })
  .catch((err) => console.log(err));
