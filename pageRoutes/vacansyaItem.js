const {Router} = require('express')
const router = Router()

router.get('/vacancia',(req,res) => {
    res.render('vacansyaItem', {isLoggedIn: false, username: ''})
})

module.exports = router