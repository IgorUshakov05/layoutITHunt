const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true },
  subscriptions: [
    {
      endpoint: { type: String, required: true },
      expirationTime: { type: Date, default: null },
      keys: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true },
      },
    },
  ],
});
module.exports = mongoose.model("WebPush", schema);
