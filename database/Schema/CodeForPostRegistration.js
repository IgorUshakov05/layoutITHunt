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
  count_try: {
    type: Number,
    required: true,
    default: 0
  }
});
module.exports = mongoose.model("CodeVerefyPost", schema);
