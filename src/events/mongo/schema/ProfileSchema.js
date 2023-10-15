const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  discordId: String,
  thmUsername: String,
  token: String,
  subscriptionStatus: Boolean,
  rank: String,
  points: String,
  level: String,
});

module.exports = mongoose.model("Profile", ProfileSchema);
