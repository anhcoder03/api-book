const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Order = new Schema(
  {
    username: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: Number, require: true },
    address: { type: String, require: true },
    totalAmount: { type: Number, require: true },
    status: { type: String, default: "Chờ xác nhận" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", Order);
