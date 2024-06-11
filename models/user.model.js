const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    password: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    status: { type: Number },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("users", userSchema);
