const {Router} = require('express')
const router = Router()

router.get('/login',(req,res) => {
    res.clearCookie('access')
    res.clearCookie('refresh')
    res.render('login')
})


module.exports = router