let ChatScheme = require('../Schema/PrivateChat')
async function deleteChatIfEmpty(chatId) {
    try {
      // Найти чат по ID
      const chat = await ChatScheme.findOne({id:chatId});
        console.log("Удаление чата " , chatId)
      if (!chat) {
        console.log('Chat not found.');
        return false;
      }
  
      // Проверить, есть ли сообщения в чате
      if (chat.mesages.length === 0) {
        // Удалить чат, если сообщений нет
        await ChatScheme.deleteOne({ id: chatId });
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Error while deleting chat:', error);
    }
  }

module.exports = deleteChatIfEmpty