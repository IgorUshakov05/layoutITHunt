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
  dateRegistration: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'В поиске',
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
  job: {
    type: String,
    default: ''
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
    default: '',
  },
  // contacts: [contactSchema],
  portfolio: {
    type: Object,
    default: [],
  },
  city: {
    type: String,
    default: '',
  },
  skills: {
    type: Object,
    default: [],
  },
  avatar: {
    type: String,
    default: './assets/pictures/defaultAvatar.png',
  },
});
module.exports = mongoose.model("User", schema);
