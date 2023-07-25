const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minglength: 3, maxlength: 30 },
    email: { type: String, required: true, minglength: 3, maxlength: 200, unique: true },
    password: { type: String, required: true, minglength: 3, maxlength: 1024 },
    codereferral: { type: String, required: true, minglength: 3, maxlength: 30, unique: true },
    avatar: {type: String, required: true},
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
