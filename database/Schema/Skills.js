const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: false
  },
  title: {
    type: String,
    required: true,
    unique: true
  }
});
module.exports = mongoose.model("Skill", schema);
