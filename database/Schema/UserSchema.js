const mongoose = require("mongoose");
// const contactSchema = new mongoose.Schema({
//     type: { type: String, default: 'other' },
//     url: { type: String, required: true },
//   });
const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  surname: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  birthDay: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  premium: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  age: {
    type: Number,
    default: null,
  },
  // contacts: [contactSchema],
  portfolio: {
    type: Object,
    default: [],
  },
  city: {
    type: String,
    default: null,
  },
  skills: {
    type: Object,
    default: null,
  },
  avatar: {
    type: String,
    default: "/assets/pictures/defaultAvatar.png",
  },
});
module.exports = mongoose.model("User", schema);
