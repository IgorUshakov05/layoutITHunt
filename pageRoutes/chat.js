const {Router} = require('express')
const {decodeAccessToken} = require('../api/tokens/accessToken')

const router = Router()

router.get('/chats', (req,res) => {
    let access = req.cookies.access;
    let user = decodeAccessToken(access)
    console.log(user)
    res.render('chats', { isLoggedIn:!!user, id:user.userID})
})

module.exports = router