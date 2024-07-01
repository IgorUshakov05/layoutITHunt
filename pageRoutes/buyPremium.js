const {Router} = require('express')
const router = Router()
const {isAuth} = require('../api/middlewares/auth');

router.get('/buy-premium', isAuth,(req,res) => {
    res.render('buy-premium', {isLoggedIn: false,username:"Igor"})
})

module.exports = router