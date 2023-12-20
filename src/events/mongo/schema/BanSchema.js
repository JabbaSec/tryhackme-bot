const mongoose = require("mongoose");

const BanSchema = new mongoose.Schema({
  discordId: String,
  username: String,
  token: String,
  subscribed: Boolean,
  level: String,
  avatar: String,
});

module.exports = mongoose.model("Ban", BanSchema);
