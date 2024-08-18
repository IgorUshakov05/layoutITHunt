const {Router} = require('express')
const router = Router()
const {isAuth} = require('../api/middlewares/auth');
const {decodeAccessToken} = require('../api/tokens/accessToken')

router.get('/editComapny',isAuth,async (req,res) => {
     let access = await req.cookies.access;
    let user =  decodeAccessToken(access)
    res.render("EditCompany", {
      isLoggedIn: !!user,
      id: user.userID,
      chatList: user.chatList || null,
    });
})


module.exports = router