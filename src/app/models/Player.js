const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Player = new Schema(
  {
    name: String,
    avatar: String,
    backgroundImage: String,
    jersey_number: Number,
    position: String,
    dob: Date,
    quote: String,
    biography: String,
    country: String,
    joined: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Player", Player);
