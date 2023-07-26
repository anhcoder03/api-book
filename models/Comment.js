const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema(
  {
    rating: { type: Number, min: 1, max: 5, require: true },
    review: { type: String, require: true },
    username: { type: String, require: true },
    userImage: { type: String, require: true },
    productId: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", Comment);
