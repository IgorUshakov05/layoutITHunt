const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    unique: true,
  },
  typePremium: {
    type: String,
    required: true,
  },
  typePay: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  timePay: {
    type: String,
    default: "",
  },
  nextTimePay: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("subscription", schema);
