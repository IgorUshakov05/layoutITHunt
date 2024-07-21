const {Router} = require('express')
const router = Router()
const {decodeAccessToken} = require('../api/tokens/accessToken')

router.get('/inbox/company', (req,res) => {
    let access = req.cookies.access;
    let user = decodeAccessToken(access)
    console.log(user)
    res.render('inboxCompany', { isLoggedIn:!!user, id:user.userID,chatList: user.chatList || null})
})

module.exports = router