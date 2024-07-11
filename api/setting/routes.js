const {Router} = require('express')
const router = Router()
const {decodeAccessToken} = require('../tokens/accessToken')
const {updateInfoUser} = require('./Request/updateUserInfo')
const {isAuth} = require('../middlewares/auth')

router.post('/setSettings', isAuth, async(req,res) => {
    let data = req.body
    let id = decodeAccessToken(req.cookies.access).userID
    console.log(data)
    let update = await updateInfoUser(id, req.body)
    console.log(update)
    res.json(data)
})

module.exports = router