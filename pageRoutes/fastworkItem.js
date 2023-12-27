const {Router} = require('express')
const router = Router()

router.get('/fast-workItem',(req,res) => {
    res.render('fast-workItem', {isLoggedIn: false, username: ''})
})

module.exports = router