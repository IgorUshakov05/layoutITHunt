const {Router} = require('express')
const router = Router()

router.get('/create-fast-work', (req,res) => {
    res.render('createFastWork', {isLoggedIn: false, username: ''})
})

module.exports = router