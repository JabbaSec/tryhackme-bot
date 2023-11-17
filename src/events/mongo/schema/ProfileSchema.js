const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  discordId: String,
  username: String,
  token: String,
  subscribed: Boolean,
  level: String,
  avatar: String,
});

module.exports = mongoose.model("Profile", ProfileSchema);
