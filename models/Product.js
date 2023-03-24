const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const Product = new Schema(
  {
    title: { type: String, require: true },
    author: { type: String, require: true },
    desc: { type: String, require: true },
    year: { type: Number, require: true },
    category: { type: String, require: true },
    price: { type: Number, require: true },
    image: { type: String, require: true },
    slug: { type: String, slug: "title" },
    review_count: { type: Number, default: 0 },
    average_score: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Product", Product);
