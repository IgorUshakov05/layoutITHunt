const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["request", "cancel", "access", "not_pay", "paid"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const SubscriptionNotificationSchema = new mongoose.Schema({
  creator_id: {
    type: String,
    required: true,
    ref: "User",
  },
  notifications: [NotificationSchema],
});

module.exports = mongoose.model(
  "CompanyStatusNotification",
  SubscriptionNotificationSchema
);
