const {Router} = require('express')
const router = Router()
const {decodeAccessToken} = require('../api/tokens/accessToken')

router.get('/inbox/other', (req,res) => {
    let access = req.cookies.access;
    let user = decodeAccessToken(access)
    console.log(user)
    res.render('inboxOther', { isLoggedIn:!!user, id:user.userID,chatList: user.chatList || null})
})

module.exports = router