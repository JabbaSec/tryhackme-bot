const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  discordId: String,
  username: String,
  token: String,
  subscribed: Boolean,
  rank: String,
  points: String,
  level: String,
  avatar: String,
});

module.exports = mongoose.model("Profile", ProfileSchema);
