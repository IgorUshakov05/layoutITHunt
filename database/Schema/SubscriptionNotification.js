const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["start", "warning", "end"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  time_left: {
    type: String,
    required: false,
  },
  subscription_level: {
    type: String,
    enum: ["Шорт", "Мидл", "Лонг"],
    required: false,
  },
  end_date: {
    type: String,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const SubscriptionNotificationSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    ref: "User",
  },
  type: {
    type: String,
    enum: ["subscription"],
    required: true,
  },
  notifications: [NotificationSchema],
});

module.exports = mongoose.model(
  "SubscriptionNotification",
  SubscriptionNotificationSchema
);
