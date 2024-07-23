const Chat = require("../Schema/PrivateChat");
const { v4 } = require("uuid");
const { Temporal } = require("@js-temporal/polyfill");
let updateUserChatList = require("../Request/AppenChatToUser");
const getCurrentDateTime = () => {
  const now = Temporal.Now.plainDateTimeISO();

  const date = now.toPlainDate().toString({ calendarName: "never" });
  const time = now
    .toPlainTime()
    .toString({ smallestUnit: "minute", fractionalSecondDigits: 0 });

  const formattedDate = date.split("-").reverse().join("-"); // Преобразование YYYY-MM-DD в DD-MM-YYYY
  const formattedTime = time.slice(0, 5); // Оставляем только hh:mm

  return {
    date: formattedDate,
    time: formattedTime,
  };
};

module.exports = getCurrentDateTime;

const addMessageToChat = async (chatId, userId, content) => {
  try {
    const chat = await Chat.findOne({ id: chatId });

    if (!chat) {
      throw new Error("Chat not found");
    }
    if (chat.mesages.length == 0) {
      const recipients = await chat.users.filter(
        (user) => user.userID !== userId
      );
      await console.log("Ч", chatId, "Кт", userId, "Ко", recipients[0].userID);
      await updateUserChatList(userId, chatId, recipients[0].userID);
    }
    const userExists = chat.users.some((user) => user.userID === userId);

    if (!userExists) {
      throw new Error("User not found in chat");
    }
    const { date, time } = getCurrentDateTime();

    const newMessage = {
      id: v4(),
      userID: userId,
      content: content,
      date: date,
      time: time,
      status: "sent",
    };

    chat.mesages.push(newMessage);
    await chat.save();

    return newMessage;
  } catch (error) {
    throw error;
  }
};

module.exports = addMessageToChat;
