const mongoose = require("mongoose");
const skillsScheme = new Schema({
  title: {
    type: String,
    required: true,
  },
});
const typeWorkSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
});
const priceSchema = new Schema({
  minPrice:{
    type: Number,
    required: false,
    unique: false,
  },
  maxPrice:{
    type: Number,
    required: false,
    unique: false,
  },
  agrement:{
    type: Boolean,
    required: false,
    unique: false,
  } 
});
const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: false,
  },
  userID: {
    type: String,
    required: true,
    unique: false,
  },
  special: {
    type: String,
    required: true,
    unique: true,
  },
  skills: [skillsScheme],
  typeWork: [typeWorkSchema],
  expirient:{
    type: String,
    required: true,
    unique: false,
  }, 
  price: [priceSchema],
  description: {
    type: String,
    required: true,
    unique: false,
  }
});
module.exports = mongoose.model("Skill", schema);
