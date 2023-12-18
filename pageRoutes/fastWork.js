const {Router} = require('express')
const router = Router()

router.get('/fast-work',(req,res) => {
    res.render('fast-work', {isLoggedIn: false, username: ''})
})

module.exports = router