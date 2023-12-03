const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const sharp = require("sharp");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("newroom")
    .setDescription("Returns the API and Client latency")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("the room that you want to announce")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    await interaction.deferReply({
      ephemeral: false,
    });

    const code = interaction.options.getString("code");
    let svg;

    const hasPermission = await client.checkPermissions(
      interaction,
      "Administrator",
      true
    );
    if (!hasPermission) return;

    room = await client.handleAPI.get_room_data(code);

    console.log(room);

    if (isSvgFile(room.data[code]image)) {
      sharp(room.data[code].image)
        .png()
        .toFile("recent_room_image.png", (err, info) => {
          if (err) throw err;
          console.log("Image converted", info);
        });

      svg = true;
    } else {
      svg = false;
    }

    const pingEmbed = new EmbedBuilder()
      .setTitle("Pong!")
      .setImage(svg ? room.data[code].image : room.data[code].image)
      .setTimestamp(Date.now())
      .setFields({
        name: "API Latency",
        value: `ms`,
      });

    await interaction.editReply({ embeds: [pingEmbed] });
  },
};

function isSvgFile(filePath) {
  return path.extname(filePath).toLowerCase() === ".svg";
}
