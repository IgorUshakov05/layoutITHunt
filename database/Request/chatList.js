const chatList = require('../Schema/ChatOfUser')
const { searchUserId } = require('./User')

const searchChatList = async (id) => {
    try {
        let newSpecial = await chatList.findOne({ id })
        await console.log(newSpecial, ' - чат лист')
        if (!newSpecial || !newSpecial.chats) {
            return false
        }
        let users = []
        for (const item of newSpecial.chats) {
            let { surname, name, avatar, id } = await searchUserId(item.userID)
            users.push({ surname, name, avatar, id, chatId: item.chatId })
        }
        return users
    } catch (e) {
        console.error(e)
        return false
    }
}

module.exports = searchChatList
