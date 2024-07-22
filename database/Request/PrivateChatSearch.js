const Chat = require("../../database/Schema/PrivateChat");

const findChat = async (userId1) => {
  try {
    const existingChat = await Chat.findOne({id:userId1});
    if (existingChat) {
      return existingChat;
    } else {
      return false
    }
  } catch (e) {
    console.error("Ошибка при поиске или создании чата:", e);
    return false;
  }
};

module.exports = findChat;
