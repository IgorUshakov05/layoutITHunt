const {Router} = require('express')
const router = Router()
const {updateInfoUser} = require('./Request/updateUserInfo')

router.post('/setSettings', async(req,res) => {
    let data = req.body
    let id = "412d4dcb-5106-4e53-ae8f-1fd89b9a24ea"
    console.log(data)
    let update = await updateInfoUser(id, req.body)
    console.log(update)
    res.json(data)
})

module.exports = router