const {Router} = require('express');
const router = Router()
const {decodeAccessToken} = require('../api/tokens/accessToken')
const {isAuthNotRequire} = require('../api/middlewares/authNotRequire')

router.get('/specialists', isAuthNotRequire,(req,res) => {    
    let access = req.cookies.access;
    let user = decodeAccessToken(access)
    console.log(user)
    res.render('specialist', { isLoggedIn:!!user, id:user.userID})
})

module.exports = router