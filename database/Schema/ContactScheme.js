const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema({
  type: { type: String, default: "other" },
  url: { type: String, required: true },
});
const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  contacts: [contactSchema],
});
module.exports = mongoose.model("Contacts", schema);
