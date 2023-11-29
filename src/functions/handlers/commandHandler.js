const { REST, Routes } = require("discord.js");
const fs = require("fs");
const ascii = require("ascii-table");

module.exports = (client) => {
  client.handleCommands = async () => {
    const table = new ascii().setHeading("Commands", "Status");

    const commandFolders = fs.readdirSync("./src/commands");
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        try {
          const command = require(`../../commands/${folder}/${file}`);
          client.commands.set(command.data.name, command);
          client.commandArray.push(command.data.toJSON());
          table.addRow(file, "✅");
        } catch (err) {
          console.error(`Error loading command ${file}:`, err);
          table.addRow(file, "❌");
        }
      }
    }

    const rest = new REST().setToken(process.env.BOT_TOKEN);

    try {
      console.log(
        `Started refreshing ${client.commandArray.length} application (/) commands.`
      );
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: client.commandArray,
      });
      console.log(
        `Successfully reloaded ${client.commandArray.length} application (/) commands.`
      );
    } catch (error) {
      console.error(error);
    }

    return console.log(table.toString(), "\n Commands loaded");
  };
};
