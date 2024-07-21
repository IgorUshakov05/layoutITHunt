const mongoose = require("mongoose");
const { Schema } = mongoose;

// Схема для чата пользователя
const chatIdScheme = new Schema({
  userID: {
    type: String,
    required: true,
  },
  chatId: {
    type: String,
    required: true,
  }
});

// Схема для списка чатов пользователя
const ChatListOfUserSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  chats: [chatIdScheme]
});

module.exports = mongoose.model("Chats", ChatListOfUserSchema);
