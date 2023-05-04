const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema(
  {
    name: String,
    price: Number,
    productImage: String,
    productImages: [String],
    description: String,
    type: String,
    available : Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", Product);
