const {Router} = require('express')
const router = Router()
const {decodeAccessToken} = require('../api/tokens/accessToken')

router.get('/fast-workItem',(req,res) => {
    let access = req.cookies.access;
    let user = decodeAccessToken(access)
    console.log(user)
    res.render('fast-workItem', { isLoggedIn:!!user, id:user.userID})
})

module.exports = router