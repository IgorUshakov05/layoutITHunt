const UserSchema = require("../../database/Schema/UserSchema");
const CodeForPostRegistration = require("../../database/Schema/CodeForPostRegistration");
const ChatListOfUserSchema = require("../../database/Schema/ChatOfUser");
const { v4 } = require("uuid");

const createUser = async (data, isVerefy = false) => {
  try {
    const { surname, name, birthDay, role, mail, password, avatar } = data;

    if (!isVerefy) {
      const verefyMail = await CodeForPostRegistration.findOne({ mail, active: true });
      if (!verefyMail) {
        return false;
      }
    }

    const findUserMail = await UserSchema.findOne({ mail });
    if (findUserMail) {
      return false;
    }

    const day = new Date().getDate().toString().padStart(2, '0');
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const year = new Date().getFullYear();

    const formattedDate = `${day}-${month}-${year}`;
    let chatID = v4()
    const user = new UserSchema({
      id: v4(),
      surname,
      name,
      birthDay,
      role,
      chatList:chatID,
      mail,
      dateRegistration: formattedDate,
      password,
      avatar
    });
    let createChat = new ChatListOfUserSchema({
      id: chatID
    })
    const saveChat = await createChat.save();
    const result = await user.save();
    return result;
  } catch (e) {
    console.error(e);
    return false;
  }
};

module.exports = createUser;
