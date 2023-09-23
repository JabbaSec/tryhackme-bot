const { InteractionType } = require("discord.js");

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const { commandName } = interaction;
      const command = client.commands.get(commandName);

      if (!command) {
        return interaction.reply({
          content: "Command not found.",
          ephemeral: true,
        });
      }

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(`Error executing command ${commandName}:`, error);
        interaction.reply({
          content: "An error occurred while executing this command.",
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      const { customId } = interaction;
      const button = client.buttons.get(customId);

      if (!button) {
        console.error(`No button found with ID: ${customId}`);
        return interaction.reply({
          content: "Button interaction failed.",
          ephemeral: true,
        });
      }

      try {
        await button.execute(interaction, client);
      } catch (error) {
        console.error(`Error executing button ${customId}:`, error);
        interaction.reply({
          content: "An error occurred while handling this button.",
          ephemeral: true,
        });
      }
    } else if (interaction.isSelectMenu()) {
      const { customId } = interaction;
      const dropdown = client.dropdowns.get(customId);

      if (!dropdown) {
        console.error(`No dropdown found with ID: ${customId}`);
        return interaction.reply({
          content: "Dropdown interaction failed.",
          ephemeral: true,
        });
      }

      try {
        await dropdown.execute(interaction, client);
      } catch (error) {
        console.error(`Error executing dropdown ${customId}:`, error);
        interaction.reply({
          content: "An error occurred while handling this dropdown.",
          ephemeral: true,
        });
      }
    } else if (interaction.type === InteractionType.ModalSubmit) {
      const { customId } = interaction;
      const modal = client.modals.get(customId);

      if (!modal) {
        console.error(`No modal found with ID: ${customId}`);
        return interaction.reply({
          content: "Modal interaction failed.",
          ephemeral: true,
        });
      }

      try {
        await modal.execute(interaction, client);
      } catch (error) {
        console.error(`Error executing modal ${customId}:`, error);
        interaction.reply({
          content: "An error occurred while handling this modal.",
          ephemeral: true,
        });
      }
    } else if (interaction.isContextMenu()) {
      const { commandName } = interaction;
      const contextCommand = client.commands.get(commandName);

      if (!contextCommand) {
        return interaction.reply({
          content: "Context command not found.",
          ephemeral: true,
        });
      }

      try {
        await contextCommand.execute(interaction, client);
      } catch (error) {
        console.error(`Error executing context command ${commandName}:`, error);
        interaction.reply({
          content: "An error occurred while executing this context command.",
          ephemeral: true,
        });
      }
    }
  },
};
