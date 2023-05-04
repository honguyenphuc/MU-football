const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Account = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    address: String,
    accountName: String,
    accountNumber: Number,
    admin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Account", Account);
