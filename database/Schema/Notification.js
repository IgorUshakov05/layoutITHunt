const mongoose = require("mongoose");
const notificationItem = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
  underType: {
    type: String,
    required: true,
  },
  created: {
    type: String,
    required: true,
  },
});
const schema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  notiList: [notificationItem],
});
module.exports = mongoose.model("NotificationCompany", schema);
