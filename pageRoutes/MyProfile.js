const {Router} = require('express')
const router = Router()

router.get('/me',(req,res) => {
    res.render('myprofile', { isLoggedIn:false})
})


module.exports = router