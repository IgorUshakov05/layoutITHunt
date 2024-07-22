const Chat = require("../../database/Schema/PrivateChat");
const { v4 } = require('uuid'); // Import UUID library

const findOrCreateChatByTwoUsers = async (userId1, userId2) => {
  try {
    // 1. Try to find an existing chat
    const existingChat = await Chat.findOne({
      users: {
        $all: [
          { $elemMatch: { userID: userId1 } },
          { $elemMatch: { userID: userId2 } }
        ]
      }
    });

    if (existingChat) {
      // 2. Chat exists, return its ID
      return existingChat.id;
    } else {
      // 3. Chat doesn't exist, create a new one
      const newChatId = v4();
      const newChat = new Chat({
        id: newChatId,
        users: [
          { userID: userId1 },
          { userID: userId2 }
        ]
      });
      await newChat.save();
      return newChatId;
    }
  } catch (e) {
    console.error("Ошибка при поиске или создании чата:", e);
    return false;
  }
};

module.exports = findOrCreateChatByTwoUsers;
