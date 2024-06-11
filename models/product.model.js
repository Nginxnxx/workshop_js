const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    product_id: { type: String, unique: true },
    product_name: { type: String },
    description: { type: String },
    price: { type: String },
    stock:{ type: String },
  
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("products", productSchema);
