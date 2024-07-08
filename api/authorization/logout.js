let {deleteTokenCookie } =require('../../database/Request/Refresh')

async function LogOut(req) {
    try {

        let refresh = req.cookies.refresh;
        if(refresh) {
            let deleteToken =await deleteTokenCookie(refresh)
            return deleteToken
        }
        return false
    }
    catch(e) {
        return false
    }
}

module.exports = LogOut;