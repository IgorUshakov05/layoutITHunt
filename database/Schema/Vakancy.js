const mongoose = require("mongoose");

const skillsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const typeWorkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

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
  }
});

const vacancySchema = new mongoose.Schema({
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
  typeWork: [typeWorkSchema],
  experience: {
    type: String,
    required: true,
  },
  price: priceSchema,
  description: {
    type: String,
    required: true,
  },
  dateAndTimeCreated: {
    type: String,
    required: true,
  },
  responses: [responseSchema],
});

module.exports = mongoose.model("Vacancy", vacancySchema);
