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
  participants: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("Giveaway", GiveawaySchema);
