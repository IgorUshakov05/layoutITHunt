const mongoose = require("mongoose");
const vacancyIDSchema = new mongoose.Schema({
  id: { 
    type: String, 
    unique: false, 
    required: true 
  },
});
const fastWorkIDSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: false,
    required: true,
  },
});
const schema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    unique: true,
  },
  vacancyID: [vacancyIDSchema],
  fastWorkID: [fastWorkIDSchema],
});
module.exports = mongoose.model("FavoriteVacancy", schema);
