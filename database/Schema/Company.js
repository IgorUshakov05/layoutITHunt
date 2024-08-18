const mongoose = require("mongoose");

const listHRSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  }
});

const vacancySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  creatorID: {
    type: String,
    required: true,
    unique: true,
  },
  INN: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  countStaffs: {
    type: Number,
    required: true,
  },
  isVarefy: {
    type: Boolean,
    required: false,
    default: false,
  },
  dataCreated: {
    type: String,
    required: true,
  },
  isFreez: {
    type: Boolean,
    required: false,
    default: false,
  },
  payLastDay: {
    type: String,
    required: false,
    default: "",
  },
  userList: [listHRSchema],
});

module.exports = mongoose.model("Company", vacancySchema);
