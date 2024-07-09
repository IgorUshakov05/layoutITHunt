const {Router} = require('express')
const router = Router()
const {updateInfoUser} = require('./Request/updateUserInfo')

router.post('/setSettings', async(req,res) => {
    let data = req.body
    let id = "8b7885b0-afc1-427b-a1f5-61b156338969"
    console.log(data)
    let update = await updateInfoUser(id, req.body)
    console.log(update)
    res.json(data)
})

module.exports = router