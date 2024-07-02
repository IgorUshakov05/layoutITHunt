const {Router} = require('express')
const router = Router()
const {decodeAccessToken} = require('../api/tokens/accessToken')

router.get('/inbox', (req,res) => {
    let access = req.cookies.access;
    let user = decodeAccessToken(access)
    console.log(user)
    res.render('inbox', { isLoggedIn:!!user, id:user.userID})
})

module.exports = router