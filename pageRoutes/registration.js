const {Router} = require('express')
const router = Router()

router.get('/registration',(req,res) => {
    res.clearCookie('access')
    res.clearCookie('refresh')
    res.render('registration')
})


module.exports = router