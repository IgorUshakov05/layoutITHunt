const mongoose = require("mongoose");

const skillsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const priceSchema = new mongoose.Schema({
  minPrice: {
    type: Number,
    required: false,
  },
  maxPrice: {
    type: Number,
    required: false,
  },
  agreement: {
    type: Boolean,
    required: false,
  },
});

const responseSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: false,
  },
  request: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const fastWorkSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  special: {
    type: String,
    required: false,
  },
  skills: [skillsSchema],
  level: {
    type: Number,
    required: true,
  },
  price: priceSchema,
  description: {
    type: String,
    required: true,
  },
  dateRemove: {
    type: String,
    required: true,
  },
  responses: [responseSchema],
});

module.exports = mongoose.model("FastWork", fastWorkSchema);
