const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Schedule = new Schema(
  {
    club: String,
    imageClub : String,
    time: Date,
    tournament: String,
    home: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Schedule", Schedule);