const UserSchema = require("../../database/Schema/UserSchema");

const searchUserId = async(id) => {
    try {
        let result = await UserSchema.findOne({id})
        return result
    }
    catch(e) {
        return false
    }
}


const searchUserEmail = async(email) => {
    try {
        let result = await UserSchema.findOne({mail:email})
        return result
    }
    catch(e) {
        return false
    }
}

module.exports = {searchUserId,searchUserEmail}