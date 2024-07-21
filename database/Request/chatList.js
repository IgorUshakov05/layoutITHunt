const chatList = require('../Schema/ChatOfUser')
const searchChatList = async (id) => {
    try {
        let newSpecial = await chatList.findOne({id})
        return newSpecial
    }
    catch(e) {
        return false
    }
}
module.exports = searchChatList