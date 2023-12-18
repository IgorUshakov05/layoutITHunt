const {Router} = require('express')
const router = Router()

router.get('/chats', (req,res) => {
    res.render('chats', {isLoggedIn: false,username:"Igor"})
})

module.exports = router