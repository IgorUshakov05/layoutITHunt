const {Router} = require('express')
const router = Router()
const {isAuth} = require('../api/middlewares/auth');

router.get('/court',isAuth,(req,res) => {
    res.render('court')
})

module.exports = router