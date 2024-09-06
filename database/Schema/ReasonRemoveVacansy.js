const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  text: {
    type: Number,
    required: true,
    unique: false
  }
});
module.exports = mongoose.model("ReasonRMVacancy", schema);
