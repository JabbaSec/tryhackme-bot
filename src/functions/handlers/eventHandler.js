const fs = require("fs");
const ascii = require("ascii-table");
const mongoose = require("mongoose");

module.exports = (client) => {
  client.handleEvents = async () => {
    const eventFolders = fs.readdirSync("./src/events");

    const table = new ascii().setHeading("Event", "Status", "Type");

    for (const folder of eventFolders) {
      const eventFiles = fs
        .readdirSync(`./src/events/${folder}`)
        .filter((file) => file.endsWith(".js"));

      switch (folder) {
        case "client":
          for (const file of eventFiles) {
            try {
              const event = require(`../../events/${folder}/${file}`);
              if (event.once)
                client.once(event.name, (...args) =>
                  event.execute(...args, client)
                );
              else
                client.on(event.name, (...args) =>
                  event.execute(...args, client)
                );
              table.addRow(file, "✅", "Client");
            } catch (err) {
              console.error(`Error loading event ${file}:`, err);
              table.addRow(file, "❌", "Client");
            }
          }
          break;

        case "mongo":
          for (const file of eventFiles) {
            try {
              const event = require(`../../events/${folder}/${file}`);
              if (event.once)
                mongoose.connection.once(event.name, (...args) =>
                  event.execute(...args, client)
                );
              else
                mongoose.connection.on(event.name, (...args) =>
                  event.execute(...args, client)
                );
              table.addRow(file, "✅", "MongoDB");
            } catch (err) {
              console.error(`Error loading Mongo event ${file}:`, err);
              table.addRow(file, "❌", "MongoDB");
            }
          }
          break;

        default:
          break;
      }
    }
    return console.log(table.toString(), "\n Events loaded");
  };
};
