const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema({
  type: { type: String, default: "" },
  url: { type: String, required: true },
});
const portfolioSchema = new mongoose.Schema({
  type: { type: String, default: "" },
  url: { type: String, required: true },
});
const favoriteScheme = new mongoose.Schema({
  person: { type: String, default: "", required: true },
});
const expiriensSchema = new mongoose.Schema({
  id: { type: String, required: true },
  company: { type: String, required: true },
  typeData: { type: String, required: true },
  special: { type: String, required: true },
  date:{ type: String, required: true },
  description: { type: String, required: true },
});
const skillsScheme = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: false,
  },
  title: {
    type: String,
    required: true,
    unique: false,
  },
});

const eduScheme = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: false,
  },
  type: {
    type: String,
    required: true,
    unique: false,
  },
  course: {
    type: String,
    required: true,
    unique: false,
  },
});
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
    default: "В поиске",
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
    default: "",
  },
  password: {
    type: String,
    required: true,
  },
  premium: {
    type: Boolean,
    default: false,
  },
  chatList: {
    type: String,
    require: true,
    unique: true
  },
  description: {
    type: String,
    default: "",
  },
  contacts: [contactSchema],
  portfolio: [portfolioSchema],
  city: {
    type: String,
    default: "",
  },
  skills: [skillsScheme],
  avatar: {
    type: String,
    default: "./assets/pictures/defaultAvatar.png",
  },
  favorite:[favoriteScheme],
  expiriens:[expiriensSchema],
  education: [eduScheme],
});
module.exports = mongoose.model("User", schema);
