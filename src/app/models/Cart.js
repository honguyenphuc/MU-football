const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Carts = new Schema(
  {
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
    },
    customerName: String,
    product: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Carts", Carts);
