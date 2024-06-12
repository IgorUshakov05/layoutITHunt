const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  skill: {
    type: String,
    required: true,
    unique: true
  }
});
module.exports = mongoose.model("userSpecial", schema);
