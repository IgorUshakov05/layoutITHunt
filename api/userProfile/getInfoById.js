let {searchUserId} = require('../../database/Request/User')

const getInfoById = (id) => {
    try {

        let userProfile = searchUserId(id)
        if (!userProfile) return false
        return userProfile
    }
    catch(e) {
        console.log(e)
        return false
    }
}

module.exports = {getInfoById}