const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    unique: false
  },
  cause: {
    type: String,
    required: true,
    unique: false
  }
});
module.exports = mongoose.model("CauseRemoveVacansy", schema);
