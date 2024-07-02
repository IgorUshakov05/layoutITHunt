const {Router} = require('express');
const router = Router()
const {decodeAccessToken} = require('../api/tokens/accessToken')

router.get('/settingsSpecialist', (req,res) => {
    let access = req.cookies.access;
    let user = decodeAccessToken(access)
    console.log(user)
    res.render('settingsSpecialist', { isLoggedIn:!!user, id:user.userID})
})

module.exports = router