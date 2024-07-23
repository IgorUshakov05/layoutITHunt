const itemChat = require("../Schema/PrivateChat");
const allChat = require("../Schema/ChatOfUser");
const userItem = require("../Schema/UserSchema");

async function updateUserChatList(userId, chatId, otherUserId) {
    try {
      const user1 = await userItem.findOne({ id: userId });
      const user2 = await userItem.findOne({ id: otherUserId });
  
      if (!user1 || !user2) {
        console.error("One of the users not found");
        return false;
      }
  
      const findHisChat = await allChat.findOne({ id: user1.chatList });
      const findMeChat = await allChat.findOne({ id: user2.chatList });
  
      if (!findHisChat || !findMeChat) {
        console.error("One of the chat lists not found");
        return false;
      }
  
      const newChatIntoHis = {
        userID: otherUserId,
        chatId
      };
  
      const newChatIntoMy = {
        userID: userId,
        chatId
      };
  
      findHisChat.chats.push(newChatIntoHis);
      findMeChat.chats.push(newChatIntoMy);
  
      await findHisChat.save();
      await findMeChat.save();
  
      console.log({ user1, user2 });
      return { user1, user2 };
    } catch (error) {
      console.error("Error updating user chat lists:", error);
      throw error;
    }
  }

module.exports = updateUserChatList;
