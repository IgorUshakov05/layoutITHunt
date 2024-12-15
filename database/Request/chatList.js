const chatList = require("../Schema/ChatOfUser");
const itemChat = require("../Schema/PrivateChat");
const { searchUsersId } = require("./User");

const searchChatList = async (id) => {
  try {
    // Ищем список чатов для указанного ID
    let chatListUser = await chatList.findOne({ id });

    // Если чатов нет или поле "chats" отсутствует, возвращаем false
    if (!chatListUser || !chatListUser.chats) {
      return false;
    }
    console.log(chatListUser, " - список чатов");

    // Формируем массив userIDs из списка чатов
    let userIDs = chatListUser.chats.map((chat) => chat.userID);

    // Получаем информацию о пользователях по их userID
    let usersInfo = await searchUsersId(userIDs);

    // Формируем массив пользователей с их данными и последними сообщениями
    const users = await Promise.all(
      chatListUser.chats.map(async (item) => {
        // Ищем пользователя по userID
        const userInfo = usersInfo.find((user) => user.id === item.userID);

        if (!userInfo) {
          console.log(`Пользователь с ID ${item.userID} не найден`);
          return null; // Если пользователь не найден, пропускаем этот элемент
        }

        // Поиск последнего сообщения для чата
        let lastMessageData = await itemChat.findOne({ id: item.chatId });

        if (
          !lastMessageData ||
          !lastMessageData.mesages ||
          lastMessageData.mesages.length === 0
        ) {
          console.log(`Нет сообщений для чата ${item.chatId}`);
          return null; // Если сообщений нет, пропускаем этот элемент
        }

        // Получаем последнее сообщение
        let lastMessage = lastMessageData.mesages.reverse()[0];

        // Возвращаем данные пользователя и последнего сообщения
        return {
          surname: userInfo.surname,
          name: userInfo.name,
          avatar: userInfo.avatar,
          avatar: userInfo.avatar,
          job: userInfo.job,
          id: userInfo.id,
          chatId: item.chatId,
          role: userInfo.role,
          lastMessage: lastMessage,
        };
      })
    );

    // Фильтруем null-значения, если пользователя или сообщения не было найдено
    return users.filter((user) => user !== null);
  } catch (e) {
    console.error("Ошибка при выполнении searchChatList:", e);
    return false; // Возвращаем false в случае ошибки
  }
};

module.exports = searchChatList;
