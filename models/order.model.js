const mongoose = require("mongoose");

const ordertSchema = new mongoose.Schema(
    {
        order_id: { type: String, unique: true},
        product_id: { type: String }, 
        quantity: { type: Number }, 
        order_date: { type: Date, default: Date.now }
      },
      {
        timestamps: true,
      }
);
module.exports = mongoose.model("orders", ordertSchema);
