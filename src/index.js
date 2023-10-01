require("dotenv").config();

const { Client, Collection, GatewayIntentBits } = require("discord.js");

const fs = require("fs");
const mongoose = require("mongoose");

const client = new Client({ intents: GatewayIntentBits.Guilds });

client.commands = new Collection();
client.buttons = new Collection();

client.commandArray = [];

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
    } catch (err) {
      console.error(err);
    }
  })
  .catch((err) => console.log(err));
