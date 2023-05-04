const mongoose = require("mongoose");

async function connect(options) {
  try {
    await mongoose.connect("mongodb://127.0.0.1/football_club_dev");
    console.log("Connect database success");
  } catch (error) {
    console.log("Error connecting database");
  }
}

module.exports = { connect };
