const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const News = new Schema(
  {
    title: String,
    headline_image: String,
    description: String,
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("News", News);
