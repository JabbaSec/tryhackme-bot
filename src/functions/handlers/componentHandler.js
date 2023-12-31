const fs = require("fs");
const ascii = require("ascii-table");

module.exports = (client) => {
  client.handleComponents = async () => {
    const table = new ascii().setHeading("Component", "Status", "Type");

    const componentFolders = fs.readdirSync("./src/components");
    for (const folder of componentFolders) {
      const componentFiles = fs
        .readdirSync(`./src/components/${folder}`)
        .filter((file) => file.endsWith(".js"));

      switch (folder) {
        case "buttons":
          for (const file of componentFiles) {
            try {
              const button = require(`../../components/${folder}/${file}`);
              client.buttons.set(button.data.name, button);
              table.addRow(file, "✅", "Button");
            } catch (err) {
              console.error(`Error loading button component ${file}:`, err);
              table.addRow(file, "❌", "Button");
            }
          }
          break;

        case "dropdowns":
          for (const file of componentFiles) {
            try {
              const dropdown = require(`../../components/${folder}/${file}`);
              client.dropdowns.set(dropdown.data.id, dropdown);
              table.addRow(file, "✅", "Dropdown");
            } catch (err) {
              console.error(`Error loading button component ${file}:`, err);
              table.addRow(file, "❌", "Dropdown");
            }
          }
          break;

        default:
          break;
      }
    }

    return console.log(table.toString(), "\n Components loaded");
  };
};
