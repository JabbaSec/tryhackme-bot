const mongoose = require("mongoose");

const GiveawaySchema = new mongoose.Schema({
  endDate: {
    type: Date,
    required: true,
  },
  winners: {
    type: Number,
    required: true,
    min: 1,
  },
  messageId: {
    type: String,
    required: false,
  },
  concluded: {
    type: Boolean,
    required: true,
    default: false,
  },
  participants: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("Giveaway", GiveawaySchema);
