const {Router} = require('express')
const router = Router()
const {decodeAccessToken} = require('../tokens/accessToken')
const {updateInfoUser} = require('./Request/updateUserInfo')
const {isAuth} = require('../middlewares/auth')

router.post('/setSettings', isAuth, async(req,res) => {
    let data = await req.body
    let id =await decodeAccessToken(req.cookies.access).userID
    console.log(data)
    let update = await updateInfoUser(id, req.body)
    await console.log(update)
    await res.status(201).json({message:"Успех!"})
})

module.exports = router