const {Router} = require('express')
const router = Router()
const {decodeAccessToken} = require('../api/tokens/accessToken')
const {isAuthNotRequire} = require('../api/middlewares/authNotRequire')

router.get('/company', isAuthNotRequire,async(req,res) => {
    let access = await req.cookies.access;
    let user =  decodeAccessToken(access)
    console.log(user)
    await res.render('company', { isLoggedIn:!!user, id:user.userID,chatList: user.chatList || null})
})

module.exports = router