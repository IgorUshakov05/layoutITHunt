const {Router} = require('express')
const router = Router()
const {decodeAccessToken} = require('../api/tokens/accessToken')
const {isAuthNotRequire} = require('../api/middlewares/authNotRequire')

router.get('/fast-work',isAuthNotRequire,(req,res) => {
    let access = req.cookies.access;
    let user = decodeAccessToken(access)
    console.log(user)
    res.render('fast-work', { isLoggedIn:!!user, id:user.userID})
})

module.exports = router