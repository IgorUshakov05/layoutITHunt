const mongoose = require("mongoose");

const listHRSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
});

const documentSchema = new mongoose.Schema({
  certificate_of_state_registration: {
    type: String,
    required: true,
  },
  tax_registration_certificate: {
    type: String,
    required: true,
  },
  egrul_egrip_record_sheet: {
    type: String,
    required: true,
  },
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
  documents: [documentSchema],
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
  nextPayDay: {
    type: String,
    required: true,
    default: "",
  },
  isFreez: {
    type: Boolean,
    required: false,
    default: false,
  },
  userList: [listHRSchema],
  paymentId: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  isAutoPay: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Company", vacancySchema);
