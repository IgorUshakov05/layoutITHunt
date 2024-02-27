const {Router} = require('express')
const router = Router()

router.get('/buy-premium', (req,res) => {
    res.render('buy-premium', {isLoggedIn: false,username:"Igor"})
})

module.exports = router