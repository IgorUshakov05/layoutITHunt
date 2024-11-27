const Chat = require("../../database/Schema/PrivateChat");
const { v4 } = require("uuid"); // Import UUID library
const UserSchema = require("../Schema/UserSchema");

const findOrCreateChatByTwoUsers = async (userId1, userId2) => {
  try {
    console.log(userId1 + " " + userId2);
    const findUsers = await UserSchema.find({
      id: { $in: [userId1, userId2] },
    });
    console.log(findUsers);
    if (findUsers.length < 2)
      return { success: false, message: "Пользователь не найден" };
    const existingChat = await Chat.findOne({
      users: {
        $all: [
          { $elemMatch: { userID: userId1 } },
          { $elemMatch: { userID: userId2 } },
        ],
      },
    });
    if (existingChat) {
      return { success: true, id: existingChat.id };
    } else {
      const newChatId = v4();
      const newChat = new Chat({
        id: newChatId,
        users: [{ userID: userId1 }, { userID: userId2 }],
      });
      await newChat.save();
      return { success: true, id: newChatId };
    }
  } catch (e) {
    console.error("Ошибка при поиске или создании чата:", e);
    return { success: false, message: "Erorr" };
  }
};

module.exports = findOrCreateChatByTwoUsers;
