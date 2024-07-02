const {Router} = require('express')
const router = Router()
const {isAuth} = require('../api/middlewares/auth');

router.get('/editComapny',isAuth,(req,res) => {
    res.render('EditCompany', { isLoggedIn:false})
})


module.exports = router