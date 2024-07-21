const {Router} = require('express');
const router = Router()
const {decodeAccessToken} = require('../api/tokens/accessToken')

router.get('/settingHR', (req,res) => {
    let access = req.cookies.access;
    let user = decodeAccessToken(access)
    console.log(user)
    res.render('settingsHR', { isLoggedIn:!!user, id:user.userID,chatList: user.chatList})
})

module.exports = router