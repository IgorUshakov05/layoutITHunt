const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: {
    type: String,
    unique: false,
  },
  mail: {
    type: String,
    required: true,
    unique: false,
  },
  code: {
    type: Number,
    required: true,
    unique: false,
  },
  active: {
    type: Boolean,
    required: true,
    default: false,
  },
  time: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model("CodeVerefyPost", schema);
