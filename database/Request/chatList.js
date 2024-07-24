const chatList = require('../Schema/ChatOfUser');
const itemChat = require('../Schema/PrivateChat');
const { searchUserId } = require('./User');

const searchChatList = async (id) => {
    try {
        let newSpecial = await chatList.findOne({ id });
        if (!newSpecial || !newSpecial.chats) {
            return false;
        }

        let users = [];
        for (const item of newSpecial.chats) {
            let { surname, name, avatar, id } = await searchUserId(item.userID);

            // Поиск последнего сообщения для чата
            let lastMessageData = await itemChat.findOne(
                { id: item.chatId },
            );
            console.log(lastMessageData, ' - ласт месс')

            console.log(lastMessageData.mesages.reverse()[0] , ' чат')
            users.push({ surname, name, avatar, id, chatId: item.chatId, lastMessage:lastMessageData.mesages[0]});
        }
        
        return users;
    } catch (e) {
        console.error(e);
        return false;
    }
}

module.exports = searchChatList;
