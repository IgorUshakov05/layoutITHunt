const mongoose = require("mongoose");
const { Schema } = mongoose;

// Схема для чата пользователя
const usersScheme = new Schema({
  userID: {
    type: String,
    required: true,
  },
});

const messagesScheme = new Schema({
  id: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: false,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Схема для списка чатов пользователя
const ChatUserSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  users: [usersScheme],
  mesages: [messagesScheme],
});

module.exports = mongoose.model("ChatPrivate", ChatUserSchema);
